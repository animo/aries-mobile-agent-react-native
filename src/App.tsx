import {
  Agent,
  ConnectionRecord,
  decodeInvitationFromUrl,
} from 'aries-framework-javascript';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Button,
  TextInput,
  Text,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {initAgent} from './agentInit';

const App = () => {
  const [agent, setAgent] = useState<Agent>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [connection, setConnection] = useState<ConnectionRecord | null>(null);

  async function setupAgent() {
    const agent = await initAgent();
    console.log('got agent');

    await agent.init();
    console.log('agent initialized');
    setAgent(agent);
    setIsInitialized(true);
  }

  async function createConnection() {
    const invitationMessage = await decodeInvitationFromUrl(invitation);
    const connection = await agent.connections.receiveInvitation(
      invitationMessage.toJSON(),
      {
        autoAcceptConnection: true,
      },
    );

    setConnection(connection);

    setInterval(async () => {
      const conn = await agent.connections.find(connection.id);
      setConnection(conn);
    }, 1000);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Button title="Init Agent" onPress={setupAgent} />

              {isInitialized && (
                <>
                  <TextInput onChangeText={setInvitation} />
                  <Button
                    title="Create Connection"
                    onPress={createConnection}
                  />
                </>
              )}

              {connection && (
                <>
                  <Text>Connection State: {connection.state}</Text>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});

export default App;
