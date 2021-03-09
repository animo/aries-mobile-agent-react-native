import {
  ConnectionEventType,
  JsonTransformer,
  ProofStateChangedEvent,
  RequestedCredentials,
  RequestPresentationMessage,
} from 'aries-framework-javascript'
import { ProofRecord } from 'aries-framework-javascript/build/lib/storage/ProofRecord'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useAgent } from '../agent/AgentProvider'
import { ProofList } from '../components/ProofList'
import { BaseView } from './BaseView'

const ProofsView: React.FC = (): React.ReactElement => {
  const [proofs, setProofs] = useState<ProofRecord[]>([])
  const [, setModalVisible] = useState(false)
  const [, setModalProof] = useState<ProofRecord | undefined>(undefined)

  const { agent } = useAgent()

  const fetchProofs = async (): Promise<void> => {
    const proofs = await agent.proof.getAll()
    setProofs(proofs)
  }

  const showNewProofRequestAlert = async (record: ProofRecord): Promise<void> => {
    const requestMessage =
      record.requestMessage instanceof RequestPresentationMessage
        ? record.requestMessage
        : JsonTransformer.fromJSON(record.requestMessage, RequestPresentationMessage)
    const retreivedCredentials = []
    const proofRequest = requestMessage.indyProofRequest
    const requestedCredentials = await agent.proof.getRequestedCredentialsForProofRequest(proofRequest, undefined)
    const connectionString = `From: ${record.connectionId}\n\n`
    const stateString = `State: ${record.state}\n\n`
    const credentials = []
    await Promise.all(
      Object.keys(requestedCredentials.requestedAttributes).map(async key => {
        const credId = requestedCredentials.requestedAttributes[key].credentialId
        if (!retreivedCredentials.some(id => id === credId)) {
          retreivedCredentials.push(credId)
          const credential = await agent.credentials.getIndyCredential(credId)
          credentials.push(credential.attributes)
        }
      })
    )
    let attributesString = 'Attributes:\n'
    credentials.forEach(credential => {
      Object.keys(credential).map(key => {
        attributesString += `\t- ${key} : ${credential[key]}\n`
      })
    })

    Alert.alert(
      'New Proof Request',
      connectionString.concat(stateString).concat(attributesString),
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: (): void => onProofDecline(),
        },
        { text: 'Accept', onPress: async (): Promise<void> => await onProofAccept(record, requestedCredentials) },
      ],
      {
        cancelable: true,
      }
    )
  }

  const handlerProofStateChanged = async (event: ProofStateChangedEvent): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log(
      `Present proof event for: ${event.proofRecord.id}, prev state -> ${event.previousState} new state: ${
        event.proofRecord.state
      }`
    )
    const newProof = await agent.proof.getById(event.proofRecord.id)
    const index = proofs.findIndex((x: ProofRecord) => x.id === newProof.id)

    if (index === -1) {
      showNewProofRequestAlert(newProof)

      setProofs(proofs => [...proofs, newProof])
      return
    }

    const newState = [...proofs]
    newState[index] = newProof
    setProofs(newState)
  }

  const onProofAccept = async (record: ProofRecord, requestedCredentials: RequestedCredentials): Promise<void> => {
    if (record.state === 'request-received') {
      await agent.proof.acceptRequest(record.id, requestedCredentials)
    }

    setModalVisible(false)
    setModalProof(undefined)
  }

  const onProofDecline = (): void => {
    setModalVisible(false)
    setModalProof(undefined)
  }

  useEffect(() => {
    agent.proof.events.removeAllListeners(ConnectionEventType.StateChanged)
    agent.proof.events.on(ConnectionEventType.StateChanged, handlerProofStateChanged)
  }, [proofs])

  useEffect(() => {
    fetchProofs()
    agent.proof.events.on(ConnectionEventType.StateChanged, handlerProofStateChanged)
  }, [])

  return (
    <BaseView viewTitle="proofs">
      <ProofList proofRecords={proofs} showProofModal={showNewProofRequestAlert} />
    </BaseView>
  )
}

export { ProofsView }
