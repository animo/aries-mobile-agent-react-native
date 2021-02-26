import { ConnectionEventType, ConnectionRecord, ConnectionStateChangedEvent } from 'aries-framework-javascript'
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
    // eslint-disable-next-line no-console
    console.log(
      `connection event for: ${event.connectionRecord.id}, previous state -> ${event.previousState} new state: ${
        event.connectionRecord.state
      }`
    )

    const index = connections.findIndex((x: ConnectionRecord) => x.id === event.connectionRecord.id)

    if (index === -1) {
      setConnections(connections => [...connections, event.connectionRecord])
      return
    }

    const newState = [...connections]
    newState[index] = event.connectionRecord
    setConnections(newState)
  }

  useEffect(() => {
    agent.connections.events.removeAllListeners(ConnectionEventType.StateChanged)
    agent.connections.events.on(ConnectionEventType.StateChanged, handleConnectionStateChange)
  }, [connections])

  useEffect(() => {
    fetchConnections()
    agent.connections.events.on(ConnectionEventType.StateChanged, handleConnectionStateChange)
  }, [])

  return (
    <BaseView viewTitle="connections">
      <ConnectionList connectionRecords={connections} onPress={showInvitationAlert} />
    </BaseView>
  )
}

export { ConnectionsView }
