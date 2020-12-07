<p align="center">
  <img alt="Hyperledger Aries logo" src="images/aries-logo.png" width="100px" />
  <h1 align="center">Aries Mobile Agent React Native</h1>
  <p align="center"><font size="+1">Built using TypeScript</font></p>
</p>

Aries Mobile Agent React Native is a mobile agent built on top of [Aries Framework JavaScript](https://github.com/hyperledger/aries-framework-javascript)

## Usage

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [React Native Development Environment](https://reactnative.dev/docs/environment-setup)

Besides the prerequisites listed above, the mobile agent relies on an external mediator to receive messages. You can start a sample mediator from the Aries Framework JavaScript repo. Run the following to start two sample mediators:

```sh
git clone https://github.com/hyperledger/aries-framework-javascript.git
cd aries-framework-javascript

docker-compose -f docker/docker-compose-mediators.yml -f docker/docker-compose-mediators-ngrok.yml up
```

The logs will output the public ngrok URL the mediator is exposed at. Copy the `"url"` value from the output (either alice or bob), it should look something like `https://90eab166f78c.ngrok.io`:

```
alice-mediator_1  | 2020-12-07T09:27:09.786Z aries-framework-javascript ---------- Creating agent with config ----------
alice-mediator_1  |  {
alice-mediator_1  |   "url": "https://90eab166f78c.ngrok.io",
alice-mediator_1  |   "port": "3001",
alice-mediator_1  |   "label": "RoutingMediator01",
alice-mediator_1  |   "walletConfig": {
alice-mediator_1  |     "id": "mediator01"
alice-mediator_1  |   },
alice-mediator_1  |   "walletCredentials": {
alice-mediator_1  |     "key": "0000000000000000000000000Mediator01"
alice-mediator_1  |   },
alice-mediator_1  |   "publicDid": "DtWRdd6C5dN5vpcN6XRAvu",
alice-mediator_1  |   "publicDidSeed": "00000000000000000000000Forward01",
alice-mediator_1  |   "autoAcceptConnections": true
alice-mediator_1  | }
alice-mediator_1  |
```

Now update the `mediatorUrl` in `src/App.tsx` to the copied URL:

```ts
const agent = await initAgent({
  mediatorUrl: 'https://90eab166f78c.ngrok.io',
});
```

### Installing

```sh
# Install dependencies
yarn install
```

### Running

Only Android is supported at the moment. iOS support will be added soon.

```sh
# Android
yarn android
```

## Contributing

Found a bug? Ready to submit a PR? Want to submit a proposal for your grand idea? See our [CONTRIBUTING](CONTRIBUTING.md) file for more information to get you started!

## License

Aries Mobile Agent React Native is licensed under the [Apache License Version 2.0 (Apache-2.0)](LICENSE).
