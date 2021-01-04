import { Agent, InitConfig } from 'aries-framework-javascript'
import React, { useContext, useEffect, useState } from 'react'
import indy from 'rn-indy-sdk'
import { downloadGenesis, storeGenesis } from './genesis-utils'
import { HttpOutboundTransporter, PollingInboundTransporter } from './transporters'

type AgentContextProps = {
  agentConfig: Partial<InitConfig>
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
    const genesis = await downloadGenesis()
    const genesisPath = await storeGenesis(genesis, 'genesis.txn')

    const inbound = new PollingInboundTransporter()
    const outbound = new HttpOutboundTransporter()

    const agentConfig: InitConfig = {
      label: 'javascript',
      walletConfig: { id: 'wallet' },
      walletCredentials: { key: '123' },
      autoAcceptConnections: true,
      poolName: 'test-103',
      genesisPath,
      ...props.agentConfig,
    }
    const newAgent = new Agent(agentConfig, inbound, outbound, indy)
    console.log('agent instance created')
    await newAgent.init()

    setAgent(newAgent)
    setLoading(false)
  }

  useEffect(() => {
    initAgent()
  }, [])

  return <AgentContext.Provider value={{ loading, agent }}>{props.children}</AgentContext.Provider>
}

export { AgentProvider, useAgent }
