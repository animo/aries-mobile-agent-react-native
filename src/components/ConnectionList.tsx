import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { Divider, List, ListItem } from '@ui-kitten/components'
import { ConnectionRecord } from 'aries-framework-javascript'

type ConnectionListProps = Array<ConnectionRecord>

const ConnectionList = (props: ConnectionListProps): Element => {
  const renderItem = ({ item, index }): ReactElement => (
    <ListItem title={`${item.title} ${index + 1}`} description={`${item.description} ${index + 1}`} />
  )

  return <List style={styles.container} data={props} ItemSeparatorComponent={Divider} renderItem={renderItem} />
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
  },
})

export { ConnectionList }
