import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type KeyValueTextRowProps = {
  title: string
  value: string
}

const KeyValueTextRow: React.FC<KeyValueTextRowProps> = (props: KeyValueTextRowProps): React.ReactElement => (
  <View style={styles.keyValueTextContainer}>
    <Text style={styles.keyValueTextKey}>{props.title}:</Text>
    <Text>{props.value}</Text>
  </View>
)

const styles = StyleSheet.create({
  keyValueTextContainer: {
    // flexDirection: 'row',
    // flex: 1,
    marginVertical: 5,
  },
  keyValueTextKey: {
    fontWeight: 'bold',
  },
})

export { KeyValueTextRow }
