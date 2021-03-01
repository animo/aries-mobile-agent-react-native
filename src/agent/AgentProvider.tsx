import { Agent, InitConfig } from 'aries-framework-javascript'
import React, { useContext, useEffect, useState } from 'react'
import indy from 'rn-indy-sdk'
import { downloadGenesis, storeGenesis } from './genesis-utils'
import { HttpOutboundTransporter, PollingInboundTransporter } from './transporters'
import { v4 as uuidv4 } from 'uuid'

type AgentContextProps = {
  agentConfig: Partial<InitConfig> & { genesisUrl?: string }
  children: React.ReactNode
}

type AgentContextValue = {
  loading: boolean
  agent: Agent | undefined
}

const AgentContext = React.createContext<AgentContextValue>({
  loading: false,
  agent: undefined,
})
const useAgent = (): AgentContextValue => useContext(AgentContext)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const AgentProvider = (props: AgentContextProps) => {
  const [agent, setAgent] = useState<Agent | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  const initAgent = async (): Promise<void> => {
    let genesisPath = props.agentConfig.genesisPath
    if (props.agentConfig.genesisUrl) {
      const genesis = await downloadGenesis(props.agentConfig.genesisUrl)
      genesisPath = await storeGenesis(genesis, 'genesis.txn')
    }

    const inbound = new PollingInboundTransporter()
    const outbound = new HttpOutboundTransporter()
    const id = uuidv4()
    console.log(id)

    const agentConfig: InitConfig = {
      label: id,
      walletConfig: { id },
      walletCredentials: { key: id },
      autoAcceptConnections: true,
      poolName: 'test-103',
      ...props.agentConfig,
      genesisPath,
    }
    const newAgent = new Agent(agentConfig, inbound, outbound, indy)
    // eslint-disable-next-line no-console
    console.log('agent instance created')
    await newAgent.init()

    setAgent(newAgent)
    setLoading(false)
  }

  useEffect(() => {
    try {
      initAgent()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  }, [])

  return <AgentContext.Provider value={{ loading, agent }}>{props.children}</AgentContext.Provider>
}

export { AgentProvider, useAgent }
