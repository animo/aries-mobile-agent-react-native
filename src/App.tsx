import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry, StyleService, useStyleSheet } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import React from 'react'
import 'react-native-get-random-values'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AgentProvider } from './agent/AgentProvider'
import { RootView } from './views/RootView'

const App = (): Element => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <AgentProvider agentConfig={{ mediatorUrl: 'https://573c94f0d09a.ngrok.io' }}>
          <RootView />
        </AgentProvider>
      </ApplicationProvider>
    </>
  )
}

export default App
