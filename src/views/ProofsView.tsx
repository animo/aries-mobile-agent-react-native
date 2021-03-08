import {
  ConnectionEventType,
  JsonTransformer,
  ProofStateChangedEvent,
  RequestPresentationMessage,
} from 'aries-framework-javascript'
import { ProofRecord } from 'aries-framework-javascript/build/lib/storage/ProofRecord'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import base64 from 'react-native-base64'
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

  // TODO: first request adds two credentials to the list
  const showNewProofRequestAlert = (record: ProofRecord): void => {
    const requestMessage = JsonTransformer.fromJSON(record.requestMessage, RequestPresentationMessage)

    const connectionString = `From: ${record.connectionId}\n\n`
    const stateString = `State: ${record.state}\n\n`
    const attributeString = 'Attributes:\n'

    // X DOES NOET REACH :-(
    // const x = `requestMessage, attach: ${JSON.stringify(requestMessage['request_presentations~attach'])}`

    const base64Cred = record['requestMessage']['request_presentations~attach'][0].data.base64
    const proofRequest = JSON.parse(base64.decode(base64Cred))
    const requestedAttributes = proofRequest.requested_attributes
    const attributes = Object.keys(requestedAttributes).map(key => `\t- ${requestedAttributes[key].name}`)
    const attributesString = attributes.join('\n')

    Alert.alert(
      'New Proof Request',
      connectionString
        .concat(stateString)
        .concat(attributeString)
        .concat(attributesString),
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: (): void => onProofDecline(),
        },
        { text: 'Accept', onPress: async (): Promise<void> => await onProofAccept(record) },
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

  const onProofAccept = async (record: ProofRecord): Promise<void> => {
    // TODO: get the second argument of function below
    const requestMessage =
      record.requestMessage instanceof RequestPresentationMessage
        ? record.requestMessage
        : JsonTransformer.fromJSON(record.requestMessage, RequestPresentationMessage)
    const proofRequest = requestMessage.indyProofRequest
    const requestedCredentials = await agent.proof.getRequestedCredentialsForProofRequest(proofRequest, undefined)
    await agent.proof.acceptRequest(record.id, requestedCredentials)

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
