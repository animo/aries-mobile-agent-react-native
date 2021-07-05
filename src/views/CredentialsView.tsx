import { CredentialEventTypes, CredentialRecord, CredentialStateChangedEvent } from 'aries-framework'
import React, { useEffect, useState } from 'react'
import { useAgent } from '../agent/AgentProvider'
import { CredentialList } from '../components/CredentialList'
import { BaseView } from './BaseView'
import { Alert } from 'react-native'

const CredentialsView: React.FC = (): React.ReactElement => {
  const [credentials, setCredentials] = useState<CredentialRecord[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalCredential, setModalCredential] = useState<CredentialRecord | undefined>(undefined)

  const { agent } = useAgent()

  async function fetchCredentials(): Promise<void> {
    const credentials = await agent.credentials.getAll()
    setCredentials(credentials)
  }

  const showNewCredentialOfferAlert = (record: CredentialRecord): void => {
    let bodyString = `From: ${record.connectionId}\n\n`
    // bodyString = bodyString.concat(`${record.offer.credentialPreview.}`)
    bodyString = bodyString.concat(`State: ${record.state}\n\n`)
    let attributeStrings = 'Attributes:\n'

    for (const attribute of record.offerMessage.credentialPreview.attributes) {
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

  const handleCredentialStateChanged = async (event: CredentialStateChangedEvent): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log(
      `credential event for: ${event.payload.credentialRecord.id}, prev state -> ${
        event.payload.previousState
      } new state: ${event.payload.credentialRecord.state}`
    )

    const newCredential = await agent.credentials.getById(event.payload.credentialRecord.id)
    setCredentials(credentials => {
      const index = credentials.findIndex((x: CredentialRecord) => x.id === newCredential.id)

      if (index === -1) {
        showNewCredentialOfferAlert(newCredential)
        return [...credentials, newCredential]
      }

      const newState = [...credentials]
      newState[index] = newCredential
      return newState
    })
  }

  const showCredentialModal = (record: CredentialRecord): void => {
    setModalCredential(record)
    setModalVisible(true)
  }

  const onCredentialAccept = async (record: CredentialRecord): Promise<void> => {
    if (record.state === 'offer-received') {
      await agent.credentials.acceptOffer(record.id)
    }
    if (record.state === 'credential-received') {
      await agent.credentials.acceptCredential(record.id)
    }
    setModalVisible(false)
    setModalCredential(undefined)
  }

  const onCredentialDecline = (): void => {
    setModalVisible(false)
    setModalCredential(undefined)
  }

  useEffect(() => {
    fetchCredentials()
    agent.events.on(CredentialEventTypes.CredentialStateChanged, handleCredentialStateChanged)

    return () => {
      agent.events.off(CredentialEventTypes.CredentialStateChanged, handleCredentialStateChanged)
    }
  }, [])

  return (
    <BaseView viewTitle="credentials">
      <CredentialList credentialRecords={credentials} showCredentialModal={showNewCredentialOfferAlert} />
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
