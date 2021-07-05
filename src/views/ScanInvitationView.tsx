import { ConnectionInvitationMessage } from 'aries-framework'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import Permissions from 'react-native-permissions'

import { useAgent } from '../agent/AgentProvider'
import { InvitationModal } from '../components'
import { BaseView } from './BaseView'

const ScannerView = ({ navigation }): React.ReactElement => {
  const [invitationUrl, setInvitationUrl] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [invitationObject, setInvitationObject] = useState<ConnectionInvitationMessage | undefined>(undefined)
  let qrScanned = false

  const cameraRef = useRef(null)
  const { agent } = useAgent()

  useEffect(() => {
    Permissions.check('ios.permission.CAMERA')
  }, [])

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

  async function onScan(scanResult: BarCodeReadEvent): Promise<void> {
    if (qrScanned === true) return

    qrScanned = true

    if (scanResult.data === null) {
      qrScanned = false
      return
    }

    const invitation = await ConnectionInvitationMessage.fromUrl(scanResult.data)

    await showInvitationAlert(invitation)
  }

  // try {
  //   Keyboard.dismiss()
  //   const invitation = await decodeInvitationFromUrl(invitationUrl)
  //   setInvitationObject(invitation)
  //   setModalVisible(true)
  // } catch (e) {
  //   console.error('Something went wrong while decoding invitation url')
  //   throw e
  // }
  // }

  async function onAccept(invite: ConnectionInvitationMessage): Promise<void> {
    await agent.connections.receiveInvitation(invite, { autoAcceptConnection: true })
    navigation.navigate('Connections')
    qrScanned = false
  }

  async function onDecline(): Promise<void> {
    setModalVisible(false)
    setInvitationObject(undefined)
    qrScanned = false
  }

  return (
    <BaseView viewTitle="Scan Invitation">
      <View style={styles.container}>
        <RNCamera
          ref={cameraRef}
          onBarCodeRead={(scanResult: BarCodeReadEvent): Promise<void> => onScan(scanResult)}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          style={styles.preview}
          type="back"
        />
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
    margin: 30,
    // alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    margin: 2,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})

export { ScannerView }
