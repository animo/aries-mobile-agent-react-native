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
  const [ourInvitation, setOurInvitation] = useState(null);
  const [theirInvitation, setTheirInvitation] = useState(null);
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

  const createConnection = async () => {
    const newConnection = await agent.connections.createConnection({ autoAcceptConnection: true });
    setOurInvitation(newConnection.invitation);
    updateConnections();
  }

  const acceptConnection = async (invitation) => {
    const acceptedConnection = await agent.connections.receiveInvitation(JSON.parse(invitation), { autoAcceptConnection: true });
    updateConnections();
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
              {/* CREATE CONNECTION */}
              {isInitialized && (
                <View style={styles.createConnection}>
                  <Button
                    title="Create Connection"
                    onPress={createConnection}
                  />
                  <TextInput
                    style={styles.ourInviteInput}
                    multiline={true}
                    value={JSON.stringify(ourInvitation)}
                  />
                </View>
              )}
              {/* ACCEPT CONNECTION */}
              {isInitialized && (
                <View style={styles.createConnection}>
                  <Button
                    title="Accept Connection"
                    onPress={() => { acceptConnection(theirInvitation) }}
                  />
                  <TextInput
                    style={styles.ourInviteInput}
                    multiline={true}
                    onChangeText={(text) => { setTheirInvitation(text) }}
                  />
                </View>
              )}
            </View>
            {/* CONNECTIONS */}
            {connections && (<View style={styles.connectionsView}>
              <Text style={styles.title}>Connections: </Text>
              <Button
                title="Refresh List"
                onPress={updateConnections} />
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
  createConnection: {
    marginTop: 10
  },
  ourInviteInput: {
    borderWidth: 1,
    borderColor: 'black',
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
