import { Divider, List, ListItem } from '@ui-kitten/components'
import { ConnectionRecord } from 'aries-framework-javascript'
import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'

type ConnectionListProps = {
  connectionRecords: Array<ConnectionRecord>
}

const ConnectionList = (props: ConnectionListProps) => {
  const renderItem = ({ item, index }): ReactElement => (
    <ListItem style={styles.item} title={item.tags.title} description={`${item.did} ${index + 1}`} />
  )

  return (
    <List
      // style={}
      // contentContainerStyle={{ ...styles.contentContainer }}
      data={props.connectionRecords}
      ItemSeparatorComponent={Divider}
      renderItem={renderItem}
    />
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    // maxHeight: 200,
  },
  item: {
    // backgroundColor: 'red',
    // width: '80%',
    // backgroundColor: 'rgba(255, 255, 255, 0.3)',
    // borderRadius: 40,
  },
})

export { ConnectionList }
