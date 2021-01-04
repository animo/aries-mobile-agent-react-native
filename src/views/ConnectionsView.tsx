import {
  ConnectionEventType,
  ConnectionRecord,
  CredentialEventType,
  CredentialRecord,
} from 'aries-framework-javascript'
import { ConnectionInvitationMessage } from 'aries-framework-javascript/build/lib/protocols/connections/ConnectionInvitationMessage'
import { ConnectionStateChangedEvent } from 'aries-framework-javascript/build/lib/protocols/connections/ConnectionService'
import { ConnectionRole } from 'aries-framework-javascript/build/lib/protocols/connections/domain/ConnectionRole'
import { ConnectionState } from 'aries-framework-javascript/build/lib/protocols/connections/domain/ConnectionState'
import {
  Authentication,
  DidDoc,
  PublicKey,
  PublicKeyType,
  Service,
} from 'aries-framework-javascript/build/lib/protocols/connections/domain/DidDoc'
import { CredentialState } from 'aries-framework-javascript/build/lib/protocols/credentials/CredentialState'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useAgent } from '../agent/AgentProvider'
import { ConnectionList } from '../components/ConnectionList'
import { BaseView } from './BaseView'

const ConnectionsView: React.FC = (): React.ReactElement => {
  const [connections, setConnections] = useState<ConnectionRecord[]>([])

  const { agent } = useAgent()

  async function fetchConnections(): Promise<void> {
    const conns = await agent.connections.getAll()
    setConnections(conns)
  }

  async function showInvitationAlert(connection: ConnectionRecord): Promise<void> {
    Alert.alert(
      'Connection Invitation',
      `ID:\t\t${connection.id}\n\nState:\t\t${connection.state}\n\nMy DID:\t\t${connection.did}\n\nTheir DID:\t\t${
        connection.theirDid
      }`,
      [
        {
          text: 'Dismiss',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      }
    )
  }

  const handleConnectionStateChange = (event: ConnectionStateChangedEvent) => {
    console.log(
      `connection event for: ${event.connection.id}, prev state -> ${event.prevState} new state: ${
        event.connection.state
      }`
    )

    const index = connections.findIndex((x: ConnectionRecord) => x.id === event.connection.id)

    if (index === -1) {
      setConnections(connections => [...connections, event.connection])
      return
    }

    const newState = [...connections]
    newState[index] = event.connection
    setConnections(newState)
  }

  useEffect(() => {
    agent.connections.events().removeAllListeners(ConnectionEventType.StateChanged)
    agent.connections.events().on(ConnectionEventType.StateChanged, handleConnectionStateChange)
  }, [connections])

  useEffect(() => {
    fetchConnections()
    agent.connections.events().on(ConnectionEventType.StateChanged, handleConnectionStateChange)
  }, [])

  return (
    <BaseView viewTitle="connections">
      <ConnectionList connectionRecords={connections} onPress={showInvitationAlert} />
    </BaseView>
  )
}

export { ConnectionsView }
