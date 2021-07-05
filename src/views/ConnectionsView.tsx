import { ConnectionEventTypes, ConnectionRecord, ConnectionStateChangedEvent } from 'aries-framework'
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

  useEffect(() => {
    const handleConnectionStateChange = (event: ConnectionStateChangedEvent) => {
      // eslint-disable-next-line no-console
      console.log(
        `connection event for: ${event.payload.connectionRecord.id}, previous state -> ${
          event.payload.previousState
        } new state: ${event.payload.connectionRecord.state}`
      )

      setConnections(connections => {
        const index = connections.findIndex(x => x.id === event.payload.connectionRecord.id)

        if (index === -1) {
          return [...connections, event.payload.connectionRecord]
        }

        const newState = [...connections]
        newState[index] = event.payload.connectionRecord
        return newState
      })
    }

    fetchConnections()
    agent.events.on(ConnectionEventTypes.ConnectionStateChanged, handleConnectionStateChange)

    return () => {
      agent.events.off(ConnectionEventTypes.ConnectionStateChanged, handleConnectionStateChange)
    }
  }, [])

  return (
    <BaseView viewTitle="connections">
      <ConnectionList connectionRecords={connections} onPress={showInvitationAlert} />
    </BaseView>
  )
}

export { ConnectionsView }
