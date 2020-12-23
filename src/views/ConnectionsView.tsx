import { ConnectionRecord } from 'aries-framework-javascript'
import { ConnectionInvitationMessage } from 'aries-framework-javascript/build/lib/protocols/connections/ConnectionInvitationMessage'
import { ConnectionRole } from 'aries-framework-javascript/build/lib/protocols/connections/domain/ConnectionRole'
import { ConnectionState } from 'aries-framework-javascript/build/lib/protocols/connections/domain/ConnectionState'
import {
  Authentication,
  DidDoc,
  PublicKey,
  PublicKeyType,
  Service,
} from 'aries-framework-javascript/build/lib/protocols/connections/domain/DidDoc'
import React from 'react'
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
  const connections = createMockConnectionRecords()

  return (
    <BaseView viewTitle="connections">
      <ConnectionList connectionRecords={connections} />
    </BaseView>
  )
}

export { ConnectionsView }
