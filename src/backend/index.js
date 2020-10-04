
const rnBridge = require('rn-bridge')
// const Client = require('cabal-client')
const debug = require('debug')
const PORT = 9081

// Echo every message received from react-native.
rnBridge.channel.on('message', (msg) => {
  rnBridge.channel.send(msg)
})

// Inform react-native node is initialized.
rnBridge.channel.send('Node was initialized.')

setTimeout(() => {
  rnBridge.channel.send('this is fineeee')
}, 5000)

try {
  const Client = require('cabal-client')
  const client = new Client()
  client.createCabal()
    .then((cabal) => {
      // resolves when the cabal is ready, returns a CabalDetails instance
    })
  rnBridge.channel.send(`app ${JSON.stringify(app)}`)
} catch (e) {
  // console.log('client is', e)
  rnBridge.channel.send(`error is ${e}`)
}

rnBridge.channel.send('ho ho ho')
