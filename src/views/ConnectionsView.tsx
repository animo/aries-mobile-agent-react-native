import { ConnectionEventType, ConnectionRecord } from 'aries-framework-javascript'
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
import React, { useEffect, useState } from 'react'
import { useAgent } from '../agent/AgentProvider'
import { ConnectionList } from '../components/ConnectionList'
import { BaseView } from './BaseView'

function createMockConnectionRecords(): ConnectionRecord[] {
  const pubKeyMock = new PublicKey('xyz', PublicKeyType.ED25519_SIG_2018, 'xyz', 'xyz')

  const didDocMock = new DidDoc(
    'xyz',
    [new Authentication(pubKeyMock)],
    [new PublicKey('xyz', PublicKeyType.ED25519_SIG_2018, 'xyz', 'xyz')],
    [new Service('xyz', 'xyz', ['xyz'], ['xyz'], 2, 'xyz')]
  )

  const connections: ConnectionRecord[] = []

  for (let i = 0; i <= 30; i++) {
    connections.push(
      new ConnectionRecord({
        id: `d3849ac3-c981-455b-a1aa-a10bea6cead8-${i}`,
        verkey: '71X9Y1aSPK11ariWUYQCYMjSewf2Kw2JFGeygEf9uZd9',
        did: 'did:sov:C2SsBf5QUQpqSAQfhu3sd2',
        didDoc: didDocMock,
        tags: {
          title: 'Animo',
        },
        state: ConnectionState.Invited,
        role: ConnectionRole.Invitee,
        invitation: new ConnectionInvitationMessage({
          label: '',
          recipientKeys: ['xyz'],
          serviceEndpoint: 'xyz',
          did: '',
        }),
        createdAt: 123,
      })
    )
  }
  return connections
}

const ConnectionsView: React.FC = (): React.ReactElement => {
  const [connections, setConnections] = useState<ConnectionRecord[]>([])

  const { agent } = useAgent()

  async function fetchConnections(): Promise<void> {
    setConnections(await agent.connections.getAll())
    console.log(connections)
  }

  useEffect(() => {
    fetchConnections()
    agent.connections.events().on(ConnectionEventType.StateChanged, (event: ConnectionStateChangedEvent) => {
      console.log(
        `connection event for: ${event.connection.id}, prev state -> ${event.prevState} new state: ${
          event.connection.state
        }`
      )

      if (event.prevState === ConnectionState.Invited && event.connection.state === ConnectionState.Requested) {
        // We can assume here that this is a 'new' connection received with the autoAccept flag enabled
        console.log('new connection received')
        setConnections(connections => [...connections, event.connection])
      }
    })
  }, [])

  return (
    <BaseView viewTitle="connections">
      <ConnectionList connectionRecords={connections} />
    </BaseView>
  )
}

export { ConnectionsView }
