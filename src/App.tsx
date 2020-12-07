import 'react-native-get-random-values';
import {
  Agent,
  ConnectionRecord,
  decodeInvitationFromUrl,
} from 'aries-framework-javascript';
import React, { useEffect, useState } from 'react';
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
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { initAgent } from './agentInit';
import Connection from './components/connection';

const App = () => {
  const [agent, setAgent] = useState<Agent>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [connection, setConnection] = useState<ConnectionRecord | null>(null);
  const [connections, setConnections] = useState<ConnectionRecord[]>(null);

  async function setupAgent() {
    const agent = await initAgent({
      mediatorUrl: 'https://90eab166f78c.ngrok.io',
    });
    console.log('got agent');

    await agent.init();
    console.log('agent initialized');
    setAgent(agent);
    setIsInitialized(true);
  }

  // Get connections when Agent state is updated
  useEffect(() => {
    updateConnections();
  }, [agent])

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

  const updateConnections = async () => {
    if (agent) {
      console.log("AGENT AVAILABLE");
      const connections = await agent.connections.getAll();
      setConnections(connections);
    }
    else {
      console.log("AGENT NOT AVAILABLE");
    }
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
            {/* CONNECTIONS */}
            {connections && (<View style={styles.connectionsView}>
              <Text style={styles.title}>Connections: </Text>
              {connections.map((connection) => {
                return (
                  <Connection connection={connection} key={connection.id} />
                )
              })}
            </View>)}
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
  connectionsView: {
    marginTop: 20,
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default App;
