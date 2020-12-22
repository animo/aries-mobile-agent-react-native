import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

import { RNCamera } from 'react-native-camera';

const ScannerView = () => {
  let camera: RNCamera = null;

  return (
    <Layout style={styles.container}>
      <Text category="h5">QR Scanner</Text>
      <RNCamera
        ref={ref => {
          camera = ref;
        }}
        style={{
          flex: 1,
          width: '100%',
        }}
      />
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

export { ScannerView };
