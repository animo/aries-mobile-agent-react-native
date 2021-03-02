import { Divider, List, Text } from '@ui-kitten/components'
import { CredentialRecord } from 'aries-framework-javascript'
import React, { ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'

type CredentialListProps = {
  credentialRecords: CredentialRecord[]
  showCredentialModal: (record: CredentialRecord) => void
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

type RenderProps = {
  item: CredentialRecord
  index: number
}

const CredentialList = (props: CredentialListProps) => {
  // const renderItem = ({ item, index }): ReactElement => (
  //   <ListItem style={styles.item} title={item.id} description={item.did} />
  // )

  const renderItem = (unit: RenderProps): ReactElement => (
    <TouchableOpacity
      style={{ marginVertical: 5, marginHorizontal: 10 }}
      onPress={() => props.showCredentialModal(unit.item)}
    >
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'column' }}>
          <ListRow title="id" value={unit.item.id} />
          {/* <ListRow title="connectionId" value={item.connectionId} /> */}

          <Text style={{ alignSelf: 'flex-end' }}>{unit.item.state}</Text>
          {/* <Text category="label">{item.did}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <List
      // style={}
      // contentContainerStyle={{ ...styles.contentContainer }}
      data={props.credentialRecords}
      ItemSeparatorComponent={Divider}
      renderItem={renderItem}
    />
  )
}

export { CredentialList }
