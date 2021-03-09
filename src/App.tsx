import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import React from 'react'
import 'react-native-get-random-values'
import { AgentProvider } from './agent/AgentProvider'
import { RootView } from './views/RootView'

const App = (): Element => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <AgentProvider
          agentConfig={{
            mediatorUrl: 'https://30ca882068a9.ngrok.io',
            genesisUrl: 'http://dev.greenlight.bcovrin.vonx.io/genesis',
          }}
        >
          <RootView />
        </AgentProvider>
      </ApplicationProvider>
    </>
  )
}

export default App
