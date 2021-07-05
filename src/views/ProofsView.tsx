import { ProofStateChangedEvent, RequestedCredentials, ProofRecord, ProofEventTypes } from 'aries-framework'
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
    const proofs = await agent.proofs.getAll()
    setProofs(proofs)
  }

  const showNewProofRequestAlert = async (record: ProofRecord): Promise<void> => {
    const retrievedCredentials = []

    console.log(JSON.stringify(record.requestMessage.indyProofRequest.toJSON(), null, 2))
    // const requestedCredentials = await agent.proofs.getRequestedCredentialsForProofRequest(
    //   record.requestMessage.indyProofRequest
    // )

    // const selectedCredentials = agent.proofs.autoSelectCredentialsForProofRequest(requestedCredentials)
    // const connectionString = `From: ${record.connectionId}\n\n`

    // const stateString = `State: ${record.state}\n\n`
    // const credentials = []
    // await Promise.all(
    //   Object.keys(selectedCredentials.requestedAttributes).map(async key => {
    //     const credId = selectedCredentials.requestedAttributes[key].credentialId
    //     if (!retrievedCredentials.some(id => id === credId)) {
    //       retrievedCredentials.push(credId)

    //       const credential = requestedCredentials.requestedAttributes[key].find(cred => cred.credentialId === credId)
    //       credentials.push(credential.credentialInfo.attributes)
    //     }
    //   })
    // )
    const attributesString = 'Attributes:\n'
    // credentials.forEach(credential => {
    //   Object.keys(credential).map(key => {
    //     attributesString += `\t- ${key} : ${credential[key]}\n`
    //   })
    // })

    Alert.alert(
      'New Proof Request',
      'test', // connectionString.concat(stateString).concat(attributesString),
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: (): void => onProofDecline(),
        },
        {
          text: 'Accept',
          onPress: async (): Promise<void> => {
            console.log('acceptie') /* await onProofAccept(record, selectedCredentials) */
          },
        },
      ],
      {
        cancelable: true,
      }
    )
  }

  const handlerProofStateChanged = async (event: ProofStateChangedEvent): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log(
      `Present proof event for: ${event.payload.proofRecord.id}, prev state -> ${
        event.payload.previousState
      } new state: ${event.payload.proofRecord.state}`
    )
    const newProof = await agent.proofs.getById(event.payload.proofRecord.id)
    setProofs(proofs => {
      const index = proofs.findIndex((x: ProofRecord) => x.id === newProof.id)

      if (index === -1) {
        showNewProofRequestAlert(newProof)

        return [...proofs, newProof]
      }

      const newState = [...proofs]
      newState[index] = newProof
      return newState
    })
  }

  const onProofAccept = async (record: ProofRecord, requestedCredentials: RequestedCredentials): Promise<void> => {
    if (record.state === 'request-received') {
      await agent.proofs.acceptRequest(record.id, requestedCredentials)
    }

    setModalVisible(false)
    setModalProof(undefined)
  }

  const onProofDecline = (): void => {
    setModalVisible(false)
    setModalProof(undefined)
  }

  useEffect(() => {
    fetchProofs()
    agent.events.on(ProofEventTypes.ProofStateChanged, handlerProofStateChanged)

    return () => {
      agent.events.off(ProofEventTypes.ProofStateChanged, handlerProofStateChanged)
    }
  }, [])

  return (
    <BaseView viewTitle="proofs">
      <ProofList proofRecords={proofs} showProofModal={showNewProofRequestAlert} />
    </BaseView>
  )
}

export { ProofsView }
