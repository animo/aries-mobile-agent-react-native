import { Divider, List, Text } from '@ui-kitten/components'
import { ProofRecord } from 'aries-framework'
import React, { ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'

type ProofListProps = {
  proofRecords: ProofRecord[]
  showProofModal: (record: ProofRecord) => void
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
  item: ProofRecord
  index: number
}

const ProofList = (props: ProofListProps) => {
  const renderItem = (unit: RenderProps): ReactElement => (
    <TouchableOpacity
      style={{ marginVertical: 5, marginHorizontal: 10 }}
      onPress={() => props.showProofModal(unit.item)}
    >
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'column' }}>
          <ListRow title="id" value={unit.item.id} />
          <Text style={{ alignSelf: 'flex-end' }}>{unit.item.state}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return <List data={props.proofRecords} ItemSeparatorComponent={Divider} renderItem={renderItem} />
}

export { ProofList }
