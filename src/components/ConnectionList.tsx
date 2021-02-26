import { Divider, List, Text } from '@ui-kitten/components'
import { ConnectionRecord } from 'aries-framework-javascript'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type ConnectionListProps = {
  connectionRecords: Array<ConnectionRecord>
  onPress: (connection: ConnectionRecord) => Promise<void>
}

type ListRowProps = {
  title: string
  value: string
}

const ListRow = (props: ListRowProps) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Text category="s1" style={{ flex: 0.3, fontWeight: 'bold' }}>
        {props.title}
      </Text>
      <Text category="s1" style={{ flex: 0.1, textAlign: 'left' }}>
        :
      </Text>
      <Text category="s1" style={{ flex: 4, alignSelf: 'flex-end' }}>
        {props.value}
      </Text>
    </View>
  )
}

const ConnectionList = (props: ConnectionListProps) => {
  // const renderItem = ({ item, index }): ReactElement => (
  //   <ListItem style={styles.item} title={item.id} description={item.did} />
  // )

  const renderItem = ({ item }): ReactElement => (
    <TouchableOpacity
      style={{ marginVertical: 5, marginHorizontal: 10 }}
      onPress={async (): Promise<void> => await props.onPress(item)}
    >
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'column' }}>
          <ListRow title="id" value={item.id} />
          <ListRow title="did" value={item.did} />

          <Text style={{ alignSelf: 'flex-end' }}>{item.state}</Text>
          {/* <Text category="label">{item.did}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
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
