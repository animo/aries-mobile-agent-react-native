import React from 'react';
import { StyleSheet } from 'react-native';

import { Layout, Text } from '@ui-kitten/components';

const CredentialsView = () => {
  return (
    <Layout style={styles.container}>
      <Text category="h5">Credentials</Text>
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

export { CredentialsView };
