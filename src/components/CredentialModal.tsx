import { Button, Card, Modal, Text } from '@ui-kitten/components'
import { CredentialRecord } from 'aries-framework-javascript'
import { ConnectionInvitationMessage } from 'aries-framework-javascript/build/lib/protocols/connections/ConnectionInvitationMessage'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyValueTextRow } from './KeyValueTextRow'

type CredentialModalProps = {
  visible: boolean
  credential: CredentialRecord
  onAccept: () => void
  onDecline: () => void
}

const Header = (): React.ReactElement => (
  <View>
    <Text category="h6">Credential Offer</Text>
  </View>
)

type FooterProps = {
  onAccept: () => void
  onDecline: () => void
}

const Footer: React.FC<FooterProps> = (props: FooterProps): React.ReactElement => (
  <View style={styles.footer}>
    <Button style={styles.footerButton} status="success" onPress={props.onAccept}>
      Accept
    </Button>
    <Button style={styles.footerButton} status="danger" onPress={props.onDecline}>
      Decline
    </Button>
  </View>
)

const CredentialModal: React.FC<CredentialModalProps> = (props: CredentialModalProps) => {
  const CardFooter = (): React.ReactElement => <Footer onAccept={props.onAccept} onDecline={props.onDecline} />
  return (
    <Modal visible={props.visible} backdropStyle={styles.backdrop} onBackdropPress={props.onDecline}>
      <Card disabled={false} header={Header} footer={CardFooter}>
        <KeyValueTextRow title="ID" value={props.credential.id} />
        <KeyValueTextRow title="Label" value={props.credential.state} />
      </Card>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  footer: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  footerButton: {
    margin: 5,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})

export { CredentialModal }
