import * as eva from '@eva-design/eva'
import { ApplicationProvider } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import 'react-native-get-random-values'
import { Provider } from 'react-redux'
import { AppNavigator } from './components/AppNavigator'
import { store } from './redux/store'
import { LoaderView } from './views'

const App = (): Element => {
  const [agentInitialized, setAgentInitalized] = useState(false)

  useEffect(() => {
    async function initializeAgent(): Promise<void> {
      //   const agent = await initAgent({
      //     mediatorUrl: 'https://33c31ff85667.ngrok.io',
      //   });

      //   await agent.init();
      //   agent.connections.receiveInvitation()
      //   store.dispatch(setConnections(await agent.connections.getAll()));

      //   DEBUG STUFF

      setTimeout(() => {
        setAgentInitalized(true)
      }, 5000)

      // setAgentInitalized(true);
    }
    initializeAgent()
  }, [])

  return (
    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        {!agentInitialized && <LoaderView />}
        {agentInitialized && (
          <Provider store={store}>
            <AppNavigator />
          </Provider>
        )}
      </ApplicationProvider>
    </>
  )
}

export default App
