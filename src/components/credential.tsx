import { CredentialRecord } from 'aries-framework-javascript'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type CredentialProps = {
  credential: CredentialRecord
}

const Credential = ({ credential }: CredentialProps): React.ReactElement => {
  const value = JSON.parse(credential.getValue())
  return (
    <View style={styles.credentialCard}>
      <Text>ID: {credential.id}</Text>
      <Text>State: {credential.state}</Text>
      <Text>Type: {credential.type}</Text>
      <Text>Values:</Text>
      {value.offer &&
        value.offer.credential_preview.attributes.map(attr => {
          return (
            <Text>
              {attr['name']}: {attr['value']}
            </Text>
          )
        })}
    </View>
  )
}

const styles = StyleSheet.create({
  credentialCard: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
  },
})

export default Credential
