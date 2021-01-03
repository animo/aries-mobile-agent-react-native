import { Agent, InboundTransporter } from 'aries-framework-javascript'
import { poll } from 'await-poll'
import axios from 'axios'

class PollingInboundTransporter implements InboundTransporter {
  public stop: boolean

  public constructor() {
    this.stop = false
  }
  public async start(agent: Agent): Promise<void> {
    await this.registerMediator(agent)
  }

  public async registerMediator(agent: Agent): Promise<void> {
    console.log('fetching mediator url')
    const mediatorUrl = agent.getMediatorUrl()
    console.log(`got mediator url: ${mediatorUrl}, fetching response`)
    const mediatorInvitationUrlResponse = await axios.get(`${mediatorUrl}/invitation`)
    console.log(`got invite response: ${mediatorInvitationUrlResponse}`)
    const response = await axios.get(`${mediatorUrl}/`)
    console.log(`got response: ${response}`)
    const { verkey: mediatorVerkey } = response.data
    await agent.routing.provision({
      verkey: mediatorVerkey,
      invitationUrl: mediatorInvitationUrlResponse.data,
    })
    this.pollDownloadMessages(agent)
  }

  private pollDownloadMessages(agent: Agent): void {
    poll(
      async () => {
        const downloadedMessages = await agent.routing.downloadMessages()
        const messages = [...downloadedMessages]
        while (messages && messages.length > 0) {
          const message = messages.shift()
          console.log('INBOUND TRANSPORT: RECEIVED MESSAGE')
          console.log(message)

          await agent.receiveMessage(message)
        }
      },
      () => !this.stop,
      5000
    )
  }
}

export { PollingInboundTransporter }
