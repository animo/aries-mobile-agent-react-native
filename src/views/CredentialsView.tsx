import {
  ConnectionEventType,
  CredentialRecord,
  CredentialStateChangedEvent,
  JsonTransformer,
  OfferCredentialMessage,
} from 'aries-framework-javascript'
import React, { useEffect, useState } from 'react'
import { useAgent } from '../agent/AgentProvider'
import { CredentialList } from '../components/CredentialList'
import { BaseView } from './BaseView'
import { Alert } from 'react-native'

const CredentialsView: React.FC = (): React.ReactElement => {
  const [credentials, setCredentials] = useState<CredentialRecord[]>([])
  const [, setModalVisible] = useState(false)
  const [, setModalCredential] = useState<CredentialRecord | undefined>(undefined)

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

    const offerMessage = JsonTransformer.fromJSON(record.offerMessage, OfferCredentialMessage)

    for (const attribute of offerMessage.credentialPreview.attributes) {
      if (attribute.value.startsWith('data:')) {
        attributeStrings = attributeStrings.concat(
          `\t- ${attribute.name}:\t\t[BLOB IMAGE]: ${attribute.value.length}\n`
        )
      } else {
        attributeStrings = attributeStrings.concat(`\t- ${attribute.name}:\t\t${attribute.value}\n`)
      }
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
      `credential event for: ${event.credentialRecord.id}, prev state -> ${event.previousState} new state: ${
        event.credentialRecord.state
      }`
    )
    const newCredential = await agent.credentials.getById(event.credentialRecord.id)
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
    agent.credentials.events.removeAllListeners(ConnectionEventType.StateChanged)
    agent.credentials.events.on(ConnectionEventType.StateChanged, handleCredentialStateChanged)
  }, [credentials])

  useEffect(() => {
    fetchCredentials()
    agent.credentials.events.on(ConnectionEventType.StateChanged, handleCredentialStateChanged)
  }, [])

  return (
    <BaseView viewTitle="credentials">
      <CredentialList credentialRecords={credentials} showCredentialModal={showNewCredentialOfferAlert} />
    </BaseView>
  )
}

export { CredentialsView }
