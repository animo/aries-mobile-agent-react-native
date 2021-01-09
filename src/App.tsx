import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import React from 'react'
import 'react-native-get-random-values'
import { Provider } from 'react-redux'
import { AgentProvider } from './agent/AgentProvider'
import { store } from './redux/store'
import { RootView } from './views/RootView'

const App = (): Element => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <AgentProvider agentConfig={{ mediatorUrl: 'https://a4cacc7c1d3b.ngrok.io' }}>
          <Provider store={store}>
            <RootView />
          </Provider>
        </AgentProvider>
      </ApplicationProvider>
    </>
  )
}

export default App
