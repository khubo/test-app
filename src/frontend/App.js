import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import nodejs from 'nodejs-mobile-react-native'

/* IntlProvider needs to be first so that error messages are translated */
const App = () => {
  useEffect(() => {
    nodejs.start('loader.js')
    nodejs.channel.addListener(
      'message',
      (msg) => {
        console.log('msg is', msg)
      },
      this
    )
    SplashScreen.hide()
  }, [])

  return (
    <View>
      <Text> Hello world</Text>
    </View>)
}

export default App
