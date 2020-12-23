import { Layout, Text } from '@ui-kitten/components'
import React from 'react'
import { StyleSheet } from 'react-native'

const CredentialsView: React.FC = (): React.ReactElement => {
  return (
    <Layout style={styles.container}>
      <Text category="h5">Credentials</Text>
    </Layout>
  )
}

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
})

export { CredentialsView }
