import { Button, Card, Modal, Text } from '@ui-kitten/components'
import { ConnectionInvitationMessage } from 'aries-framework-javascript'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyValueTextRow } from './KeyValueTextRow'

type InvitationModalProps = {
  visible: boolean
  invitation: ConnectionInvitationMessage
  onAccept: (invitation: ConnectionInvitationMessage) => Promise<void>
  onDecline: () => void
}

const Header = (): React.ReactElement => (
  <View>
    <Text category="h6">Invitation</Text>
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

const InvitationModal: React.FC<InvitationModalProps> = (props: InvitationModalProps) => {
  const CardFooter = (): React.ReactElement => (
    <Footer onAccept={() => props.onAccept(props.invitation)} onDecline={props.onDecline} />
  )
  return (
    <Modal visible={props.visible} backdropStyle={styles.backdrop} onBackdropPress={props.onDecline}>
      <Card disabled={false} header={Header} footer={CardFooter}>
        <KeyValueTextRow title="ID" value={props.invitation.id} />
        <KeyValueTextRow title="Label" value={props.invitation.label} />
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

export { InvitationModal }
