import {
  InboundTransporter,
  OutboundTransporter,
  Agent,
} from 'aries-framework-javascript';
import indy from 'rn-indy-sdk';
import axios from 'axios';
import {poll} from 'await-poll';
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
    const mediatorInvitationUrlResponse = await axios.get(
      `${mediatorUrl}/invitation`,
    );
    const response = await axios.get(`${mediatorUrl}/`);
    const {verkey: mediatorVerkey} = response.data;
    await agent.routing.provision({
      verkey: mediatorVerkey,
      invitationUrl: mediatorInvitationUrlResponse.data,
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

    try {
      if (receiveReply) {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        const data = await response.text();

        const wireMessage = JSON.parse(data);
        return wireMessage;
      } else {
        await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
    } catch (e) {
      console.log('error sending message', JSON.stringify(e));
      throw e;
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

const initAgent = async (partialConfig: Partial<InitConfig> = {}) => {
  const genesis = await downloadGenesis();
  const genesisPath = await storeGenesis(genesis, 'genesis.txn');

  const agentConfig: InitConfig = {
    label: 'javascript',
    walletConfig: {id: 'wallet'},
    walletCredentials: {key: '123'},
    autoAcceptConnections: true,
    poolName: 'test-103',
    genesisPath,
    ...partialConfig,
  };

  const result = new Agent(agentConfig, inbound, outbound, indy);
  return result;
};

export {initAgent};
