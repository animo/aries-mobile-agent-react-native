import {
  InboundTransporter,
  OutboundTransporter,
  Agent,
} from 'aries-framework-javascript';
import indy from 'rn-indy-sdk';
import axios from 'axios';
import poll from 'await-poll';
import {InitConfig} from 'aries-framework-javascript/build/lib/types';
import RNFS from 'react-native-fs';

// ==========================================================
// GENESIS FILE DOWNLOAD AND STORAGE
// ==========================================================
export async function storeGenesis(genesis: string, fileName: string) {
  const genesisPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  await RNFS.writeFile(genesisPath, genesis, 'utf8');

  return genesisPath;
}

export async function downloadGenesis() {
  const url = 'http://dev.greenlight.bcovrin.vonx.io/genesis';

  const response = await axios.get(url);

  return response.data;
}

// ==========================================================
// MAIN TRANSPORTERS
// ==========================================================
class PollingInboundTransporter implements InboundTransporter {
  public stop: boolean;

  public constructor() {
    this.stop = false;
  }
  public async start(agent: Agent) {
    await this.registerMediator(agent);
  }

  public async registerMediator(agent: Agent) {
    const mediatorUrl = agent.getMediatorUrl();
    const mediatorInvitationUrl: string = await axios.get(
      `${mediatorUrl}/invitation`,
    );
    const response = await axios.get(`${mediatorUrl}/`);
    const {verkey: mediatorVerkey} = response.data;
    await agent.routing.provision({
      verkey: mediatorVerkey,
      invitationUrl: mediatorInvitationUrl,
    });
    this.pollDownloadMessages(agent);
  }

  private pollDownloadMessages(agent: Agent) {
    poll(
      async () => {
        const downloadedMessages = await agent.routing.downloadMessages();
        const messages = [...downloadedMessages];
        console.log('downloaded messges', messages);
        while (messages && messages.length > 0) {
          const message = messages.shift();
          await agent.receiveMessage(message);
        }
      },
      () => !this.stop,
      1000,
    );
  }
}

class HttpOutboundTransporter implements OutboundTransporter {
  public async sendMessage(outboundPackage: any, receiveReply: boolean) {
    const {payload, endpoint} = outboundPackage;

    if (!endpoint) {
      throw new Error(
        `Missing endpoint. I don't know how and where to send the message.`,
      );
    }

    console.log('Sending message...');
    console.log(payload);

    if (receiveReply) {
      const response: string = await axios.post(
        `${endpoint}`,
        JSON.stringify(payload),
      );
      console.log('response', response);
      const wireMessage = JSON.parse(response);
      console.log('wireMessage', wireMessage);
      return wireMessage;
    } else {
      await axios.post(`${endpoint}`, JSON.stringify(payload));
    }
  }
}

// ==========================================================
// INITIALIZATIONS
// ==========================================================
// const inbound = new DummyInboundTransporter();
// const outbound = new DummyOutboundTransporter();
const inbound = new PollingInboundTransporter();
const outbound = new HttpOutboundTransporter();

const initAgent = async () => {
  const genesis = await downloadGenesis();
  const genesisPath = await storeGenesis(genesis, 'genesis.txn');

  const agentConfig: InitConfig = {
    label: 'javascript',
    walletConfig: {id: 'wallet-' + Math.random()},
    walletCredentials: {key: '123'},
    autoAcceptConnections: true,
    mediatorUrl: 'http://192.168.2.5:3001',
    poolName: 'test-103' + Math.random(),
    genesisPath,
  };

  const result = new Agent(agentConfig, inbound, outbound, indy);
  return result;
};

export {initAgent};
