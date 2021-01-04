import { Button, Icon, Input, Text } from '@ui-kitten/components'
import { decodeInvitationFromUrl } from 'aries-framework-javascript'
import { ConnectionInvitationMessage } from 'aries-framework-javascript/build/lib/protocols/connections/ConnectionInvitationMessage'
import React, { useState } from 'react'
import { Alert, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { useAgent } from '../agent/AgentProvider'
import { InvitationModal } from '../components'
import { BaseView } from './BaseView'

const ScannerView = ({ navigation }): React.ReactElement => {
  const [invitationUrl, setInvitationUrl] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [invitationObject, setInvitationObject] = useState<ConnectionInvitationMessage | undefined>(undefined)
  const { agent } = useAgent()

  async function onPress(): Promise<void> {
    try {
      Keyboard.dismiss()
      const invitation = await decodeInvitationFromUrl(invitationUrl)
      await showInvitationAlert(invitation)
    } catch (e) {
      console.error('Something went wrong while decoding invitation url')
      throw e
    }
  }

  async function showInvitationAlert(invite: ConnectionInvitationMessage, newInvite = false): Promise<void> {
    Alert.alert(
      'Connection Invitation',
      `ID:\t\t${invite.id}\n\nEndpoint:\t\t${invite.serviceEndpoint}`,
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: async (): Promise<void> => await onDecline(),
        },
        { text: 'Accept', onPress: async (): Promise<void> => await onAccept(invite) },
      ],
      {
        cancelable: true,
      }
    )
  }

  async function onAccept(invite: ConnectionInvitationMessage): Promise<void> {
    await agent.connections.receiveInvitation(invite.toJSON(), { autoAcceptConnection: true })
    navigation.navigate('Connections')
  }

  async function onDecline(): Promise<void> {
    setModalVisible(false)
    setInvitationObject(undefined)
  }

  const renderIcon = props => (
    <TouchableWithoutFeedback onPress={(): void => setInvitationUrl('')}>
      <Icon name="close-circle-outline" />
    </TouchableWithoutFeedback>
  )

  return (
    <BaseView viewTitle="Invitation">
      <View style={{ flex: 1 }}>
        <View style={{ margin: 10, flexDirection: 'column' }}>
          <Text style={{ margin: 5 }}>Invitation URL:</Text>
          <Input
            placeholder="insert invitation url"
            value={invitationUrl}
            onChangeText={(nextValue): void => setInvitationUrl(nextValue)}
            // accessoryRight={renderIcon}
          />
        </View>

        <Button style={{ width: '20%', alignSelf: 'center' }} onPress={onPress}>
          Go
        </Button>
      </View>
      {modalVisible && (
        <InvitationModal
          visible={modalVisible}
          onDecline={onDecline}
          onAccept={onAccept}
          invitation={invitationObject}
        />
      )}
    </BaseView>
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

export { ScannerView }
