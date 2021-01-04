import { Button, Icon, Input } from '@ui-kitten/components'
import { decodeInvitationFromUrl } from 'aries-framework-javascript'
import { ConnectionInvitationMessage } from 'aries-framework-javascript/build/lib/protocols/connections/ConnectionInvitationMessage'
import React, { useState } from 'react'
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { useAgent } from '../agent/AgentProvider'
import { InvitationModal } from '../components'
import { BaseView } from './BaseView'

const ScannerView = ({ navigation }): React.ReactElement => {
  const [invitationUrl, setInvitationUrl] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [invitationObject, setInvitationObject] = useState<ConnectionInvitationMessage | undefined>(undefined)
  const { agent } = useAgent()

  async function onScan(scanResult: any): Promise<void> {
    console.warn(scanResult.type)
    console.warn(scanResult.data)
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

  async function onAccept(): Promise<void> {
    await agent.connections.receiveInvitation(invitationObject.toJSON(), { autoAcceptConnection: true })
    setModalVisible(false)
    navigation.navigate('Connections')
  }

  async function onDecline(): Promise<void> {
    setModalVisible(false)
    setInvitationObject(undefined)
  }

  let camera = null

  return (
    <BaseView viewTitle="Scan Invitation">
      <View>
        <RNCamera
          ref={ref => {
            camera = ref
          }}
          // defaultTouchToFocus
          // flashMode={this.state.camera.flashMode}
          // mirrorImage={false}
          onBarCodeRead={scanResult => onScan(scanResult)}
          // onFocusChanged={() => {}}
          // onZoomChanged={() => {}}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          style={styles.preview}
          type={camera.type}
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
    alignItems: 'center',
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
