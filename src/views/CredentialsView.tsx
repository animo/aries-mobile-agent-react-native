import {
  ConnectionEventType,
  ConnectionRecord,
  CredentialEventType,
  CredentialOfferMessage,
  CredentialRecord,
} from 'aries-framework-javascript'
import { JsonTransformer } from 'aries-framework-javascript/build/lib/utils/JsonTransformer'
import { CredentialState } from 'aries-framework-javascript/build/lib/protocols/credentials/CredentialState'
import React, { useEffect, useState } from 'react'
import { useAgent } from '../agent/AgentProvider'
import { CredentialModal } from '../components'
import { ConnectionList } from '../components/ConnectionList'
import { CredentialList } from '../components/CredentialList'
import { BaseView } from './BaseView'
import { Alert } from 'react-native'

const CredentialsView: React.FC = (): React.ReactElement => {
  const [credentials, setCredentials] = useState<CredentialRecord[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalCredential, setModalCredential] = useState<CredentialRecord | undefined>(undefined)

  const { agent } = useAgent()

  async function fetchCredentials(): Promise<void> {
    const creds = await agent.credentials.getCredentials()
    setCredentials(creds)
  }

  const showNewCredentialOfferAlert = (record: CredentialRecord): void => {
    console.log(record.offer['credential_preview'].attributes)

    let bodyString = `From: ${record.connectionId}\n\n`
    // bodyString = bodyString.concat(`${record.offer.credentialPreview.}`)
    bodyString = bodyString.concat(`State: ${record.state}\n\n`)
    let attributeStrings = 'Attributes:\n'

    for (const attribute of record.offer['credential_preview'].attributes) {
      attributeStrings = attributeStrings.concat(`\t- ${attribute.name}:\t\t${attribute.value}\n`)
    }

    Alert.alert(
      'New Credential Offer',
      bodyString.concat(attributeStrings),
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: (): void => onCredentialDecline(),
        },
        { text: 'Accept', onPress: async (): Promise<void> => await onCredentialAccept(record) },
      ],
      {
        cancelable: true,
      }
    )
  }

  const handleCredentialStateChanged = async (event: {
    credential: CredentialRecord
    prevState: CredentialState
  }): Promise<void> => {
    console.log(
      `credential event for: ${event.credential.id}, prev state -> ${event.prevState} new state: ${
        event.credential.state
      }`
    )
    const newCredential = await agent.credentials.find(event.credential.id)
    const index = credentials.findIndex((x: CredentialRecord) => x.id === newCredential.id)

    if (index === -1) {
      showNewCredentialOfferAlert(newCredential)
      setCredentials(credentials => [...credentials, newCredential])
      return
    }

    const newState = [...credentials]
    newState[index] = newCredential
    setCredentials(newState)
  }

  const showCredentialModal = (record: CredentialRecord): void => {
    setModalCredential(record)
    setModalVisible(true)
  }

  const onCredentialAccept = async (record: CredentialRecord): Promise<void> => {
    await agent.credentials.acceptCredential(record)

    setModalVisible(false)
    setModalCredential(undefined)
  }

  const onCredentialDecline = (): void => {
    setModalVisible(false)
    setModalCredential(undefined)
  }

  useEffect(() => {
    agent.credentials.credentialService.removeAllListeners(ConnectionEventType.StateChanged)
    agent.credentials.credentialService.on(ConnectionEventType.StateChanged, handleCredentialStateChanged)
  }, [credentials])

  useEffect(() => {
    fetchCredentials()
    agent.credentials.credentialService.on(ConnectionEventType.StateChanged, handleCredentialStateChanged)
  }, [])

  return (
    <BaseView viewTitle="credentials">
      <CredentialList credentialRecords={credentials} showCredentilModal={showNewCredentialOfferAlert} />
      {/* {modalVisible && (
        <CredentialModal
          visible={modalVisible}
          onDecline={onCredentialDecline}
          onAccept={async (): Promise<void> => await onCredentialAccept(modalCredential)}
          credential={modalCredential}
        />
      )} */}
    </BaseView>
  )
}

export { CredentialsView }
