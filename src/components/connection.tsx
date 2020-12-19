import React from 'react';
import { ConnectionRecord } from 'aries-framework-javascript';
import { StyleSheet, View, Text } from 'react-native';

type ConnectionProps = {
  connection: ConnectionRecord;
};

const Connection = ({ connection }: ConnectionProps) => {
  return (
    <View style={styles.connectionCard}>
      <Text>Alias: {connection.alias}</Text>
      <Text>ID: {connection.id}</Text>
      <Text>DID: {connection.did}</Text>
      <Text>Their DID: {connection.theirDid}</Text>
      <Text>State: {connection.state}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  connectionCard: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10,
  },
});

export default Connection;
