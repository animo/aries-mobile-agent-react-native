import React, { ComponentType, useEffect, useState } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { AppNavigator } from './components/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { initAgent } from './agentInit';
import { setConnections } from './redux/slices/connectionSlice';
import 'react-native-get-random-values';

const App = (): Element => {
  const [agentInitialized, setAgentInitalized] = useState(false);

  useEffect(() => {
    async function initializeAgent(): Promise<void> {
      const agent = await initAgent({
        mediatorUrl: 'https://33c31ff85667.ngrok.io',
      });

      await agent.init();
      store.dispatch(setConnections(await agent.connections.getAll()));
      setAgentInitalized(true);
    }
    initializeAgent();
  }, []);

  return (
    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        {!agentInitialized && (
          <Layout>
            <Text>LOADING</Text>
          </Layout>
        )}

        {agentInitialized && (
          <Provider store={store}>
            <AppNavigator />
          </Provider>
        )}
      </ApplicationProvider>
    </>
  );
};

export default App;
