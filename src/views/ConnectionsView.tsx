import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { Layout, Text } from '@ui-kitten/components';
import { ConnectionList } from '../components/ConnectionList';
import { ConnectionRecord } from 'aries-framework-javascript';

const ConnectionsView = () => {
  // const connections = useSelector(state => state.connections);

  return (
    <Layout style={styles.container}>
      <Text category="h5">Connections</Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    margin: 2,
  },
});

export { ConnectionsView };
