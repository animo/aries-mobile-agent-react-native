diff --git a/index.js b/index.js
index 5c5c0c5..7b9c2d2 100644
--- a/index.js
+++ b/index.js
@@ -1,5 +1,8 @@
 import { AppRegistry } from 'react-native'
 import App from './src/App'
 import { name as appName } from './app.json'
+import debug from 'debug'
+
+debug.enable('*')
 
 AppRegistry.registerComponent(appName, () => App)
diff --git a/package.json b/package.json
index 038d2c4..0578ce5 100644
--- a/package.json
+++ b/package.json
@@ -37,7 +37,7 @@
     "react-native-svg": "^12.1.0",
     "react-redux": "^7.2.2",
     "redux": "^4.0.5",
-    "rn-indy-sdk": "0.1.8",
+    "rn-indy-sdk": "file:rn-indy-sdk-v0.1.13.tgz",
     "uuid": "^8.3.2"
   },
   "devDependencies": {
diff --git a/src/App.tsx b/src/App.tsx
index a9542d2..dc7bad0 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -13,7 +13,7 @@ const App = (): Element => {
       <ApplicationProvider {...eva} theme={eva.dark}>
         <AgentProvider
           agentConfig={{
-            mediatorUrl: 'https://bf62892feaba.ngrok.io',
+            mediatorUrl: 'https://30ca882068a9.ngrok.io',
             genesisUrl: 'http://dev.greenlight.bcovrin.vonx.io/genesis',
           }}
         >
diff --git a/src/agent/AgentProvider.tsx b/src/agent/AgentProvider.tsx
index 37df842..8860e53 100644
--- a/src/agent/AgentProvider.tsx
+++ b/src/agent/AgentProvider.tsx
@@ -36,11 +36,11 @@ const AgentProvider = (props: AgentContextProps) => {
     const outbound = new HttpOutboundTransporter()
 
     const agentConfig: InitConfig = {
-      label: 'javascript8',
-      walletConfig: { id: 'wallet8' },
-      walletCredentials: { key: '1238' },
+      label: 'javascript',
+      walletConfig: { id: 'wallet' },
+      walletCredentials: { key: '123' },
       autoAcceptConnections: true,
-      poolName: 'test-1034',
+      poolName: 'test-101',
       ...props.agentConfig,
       genesisPath,
     }
diff --git a/src/views/ProofsView.tsx b/src/views/ProofsView.tsx
index 1e90553..16c5132 100644
--- a/src/views/ProofsView.tsx
+++ b/src/views/ProofsView.tsx
@@ -2,12 +2,12 @@ import {
   ConnectionEventType,
   JsonTransformer,
   ProofStateChangedEvent,
+  RequestedCredentials,
   RequestPresentationMessage,
 } from 'aries-framework-javascript'
 import { ProofRecord } from 'aries-framework-javascript/build/lib/storage/ProofRecord'
 import React, { useEffect, useState } from 'react'
 import { Alert } from 'react-native'
-import base64 from 'react-native-base64'
 import { useAgent } from '../agent/AgentProvider'
 import { ProofList } from '../components/ProofList'
 import { BaseView } from './BaseView'
@@ -24,36 +24,48 @@ const ProofsView: React.FC = (): React.ReactElement => {
     setProofs(proofs)
   }
 
-  // TODO: first request adds two credentials to the list
-  const showNewProofRequestAlert = (record: ProofRecord): void => {
-    const requestMessage = JsonTransformer.fromJSON(record.requestMessage, RequestPresentationMessage)
+  const showNewProofRequestAlert = async (record: ProofRecord): Promise<void> => {
+    //temp tix
+    const retreivedCredentials = []
 
+    const requestMessage =
+      record.requestMessage instanceof RequestPresentationMessage
+        ? record.requestMessage
+        : JsonTransformer.fromJSON(record.requestMessage, RequestPresentationMessage)
+    const proofRequest = requestMessage.indyProofRequest
+    const requestedCredentials = await agent.proof.getRequestedCredentialsForProofRequest(proofRequest, undefined)
     const connectionString = `From: ${record.connectionId}\n\n`
     const stateString = `State: ${record.state}\n\n`
-    const attributeString = 'Attributes:\n'
-
-    // X DOES NOET REACH :-(
-    // const x = `requestMessage, attach: ${JSON.stringify(requestMessage['request_presentations~attach'])}`
-
-    const base64Cred = record['requestMessage']['request_presentations~attach'][0].data.base64
-    const proofRequest = JSON.parse(base64.decode(base64Cred))
-    const requestedAttributes = proofRequest.requested_attributes
-    const attributes = Object.keys(requestedAttributes).map(key => `\t- ${requestedAttributes[key].name}`)
-    const attributesString = attributes.join('\n')
+    const credentials = []
+    console.log('Requested credentials' + JSON.stringify(requestedCredentials.requestedAttributes))
+    await Promise.all(
+      Object.keys(requestedCredentials.requestedAttributes).map(async key => {
+        const credId = requestedCredentials.requestedAttributes[key].credentialId
+        if (!retreivedCredentials.some(id => id === credId)) {
+          retreivedCredentials.push(credId)
+          const credential = await agent.credentials.getIndyCredential(credId)
+          credentials.push(credential.attributes)
+        }
+      })
+    )
+    console.log('credentials' + JSON.stringify(credentials))
+    let attributesString = 'Attributes:\n'
+    credentials.forEach(credential => {
+      Object.keys(credential).map(key => {
+        attributesString += `\t- ${key} : ${credential[key]}\n`
+      })
+    })
 
     Alert.alert(
       'New Proof Request',
-      connectionString
-        .concat(stateString)
-        .concat(attributeString)
-        .concat(attributesString),
+      connectionString.concat(stateString).concat(attributesString),
       [
         {
           text: 'Decline',
           style: 'cancel',
           onPress: (): void => onProofDecline(),
         },
-        { text: 'Accept', onPress: async (): Promise<void> => await onProofAccept(record) },
+        { text: 'Accept', onPress: async (): Promise<void> => await onProofAccept(record, requestedCredentials) },
       ],
       {
         cancelable: true,
@@ -83,15 +95,10 @@ const ProofsView: React.FC = (): React.ReactElement => {
     setProofs(newState)
   }
 
-  const onProofAccept = async (record: ProofRecord): Promise<void> => {
-    // TODO: get the second argument of function below
-    const requestMessage =
-      record.requestMessage instanceof RequestPresentationMessage
-        ? record.requestMessage
-        : JsonTransformer.fromJSON(record.requestMessage, RequestPresentationMessage)
-    const proofRequest = requestMessage.indyProofRequest
-    const requestedCredentials = await agent.proof.getRequestedCredentialsForProofRequest(proofRequest, undefined)
-    await agent.proof.acceptRequest(record.id, requestedCredentials)
+  const onProofAccept = async (record: ProofRecord, requestedCredentials: RequestedCredentials): Promise<void> => {
+    if (record.state === 'request-received') {
+      await agent.proof.acceptRequest(record.id, requestedCredentials)
+    }
 
     setModalVisible(false)
     setModalProof(undefined)
diff --git a/yarn.lock b/yarn.lock
index 3b1a911..dad383d 100644
--- a/yarn.lock
+++ b/yarn.lock
@@ -6110,10 +6110,9 @@ rimraf@~2.2.6:
   resolved "https://registry.yarnpkg.com/rimraf/-/rimraf-2.2.8.tgz#e439be2aaee327321952730f99a8929e4fc50582"
   integrity sha1-5Dm+Kq7jJzIZUnMPmaiSnk/FBYI=
 
-rn-indy-sdk@0.1.8:
-  version "0.1.8"
-  resolved "https://registry.yarnpkg.com/rn-indy-sdk/-/rn-indy-sdk-0.1.8.tgz#a0c44ff923597b6e86f9d8ffd8caab5f59f6ce7c"
-  integrity sha512-C/sifqDFUsC5V2plBoQwXhioBLSqQLCGLbRHKrOgOu9vjGBpW9e+o9U5GkG1SFjMQX5kh4IhYwJDTlTJfO9Z9g==
+"rn-indy-sdk@file:rn-indy-sdk-v0.1.13.tgz":
+  version "0.1.13"
+  resolved "file:rn-indy-sdk-v0.1.13.tgz#1e8e17a95eaa42fa37911c1ccb474deb9f5d81d3"
   dependencies:
     buffer "^6.0.2"
 
