import React from 'react';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../assets/17021-id-scan.json';
import { Layout, StyleService, Text, useStyleSheet, useTheme } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { withStyles } from '@ui-kitten/components';

const LoaderView = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout style={styles.container}>
      <View style={styles.textContainer}>
        <Text category="h3" style={styles.titleText}>
          Initializing Your Agent
        </Text>
        <Text category="h6" style={styles.descriptionText}>
          Just a moment
        </Text>
      </View>
      <LottieView style={styles.loaderAnimation} source={loaderAnimation} autoPlay loop />
      <Text style={styles.footerText}>Made with ♥️ by the Hyperledger Community</Text>
    </Layout>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 100,
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    color: 'color-basic-300',
  },
  descriptionText: {
    color: 'color-basic-600',
  },
  loaderAnimation: {
    flex: 1,
  },
  footerText: {
    marginBottom: 150,
  },
});

export { LoaderView };
