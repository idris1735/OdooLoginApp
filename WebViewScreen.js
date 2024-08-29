import React, { useEffect, useState, useRef } from 'react'
import { WebView } from 'react-native-webview'
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const WebViewScreen = () => {
  const [cookies, setCookies] = useState(null)
  const [loading, setLoading] = useState(true)
  const webViewRef = useRef(null)
  const [redirectToMain, setRedirectToMain] = useState(false)

  useEffect(() => {
    const fetchCookies = async () => {
      const storedCookies = await AsyncStorage.getItem('cookies')
      setCookies(storedCookies ? JSON.parse(storedCookies) : [])
    }

    fetchCookies()

    const backAction = () => {
      Alert.alert('Log out', 'Do you want to log out?', [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        {
          text: 'YES',
          onPress: () => {
            AsyncStorage.clear()
            BackHandler.exitApp()
          },
        },
      ])
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  const handleWebViewLoadEnd = () => {
    setLoading(false)

    if (!redirectToMain) {
      // Redirect to the main page after the cookies have been injected
      setTimeout(() => {
        setRedirectToMain(true)
        webViewRef.current.injectJavaScript(`window.location.href = "/web";`)
      }, 2000) // Adjust the delay as needed
    }
  }

  const handleWebViewError = async (error) => {
    if (error?.description?.includes('Session Expired')) {
      console.log('Session expired, attempting re-login...')

      const username = await AsyncStorage.getItem('username')
      const password = await AsyncStorage.getItem('password')

      if (username && password) {
        try {
          const response = await axios.post(
            'https://juniperp.com/web/session/authenticate',
            {
              jsonrpc: '2.0',
              params: {
                db: 'juniperp.com',
                login: username,
                password: password,
              },
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )

          const setCookieHeader = response.headers['set-cookie']

          if (setCookieHeader && setCookieHeader.length > 0) {
            const newCookies = setCookieHeader.map(
              (cookie) => cookie.split(';')[0]
            )
            await AsyncStorage.setItem('cookies', JSON.stringify(newCookies))
            setCookies(newCookies)

            console.log('new cookies', newCookies)

            webViewRef.current.reload()
            console.log('reloading page')
          } else {
            console.error('Re-login failed: No session ID returned.')
          }
        } catch (err) {
          console.error('An error occurred during re-login:', err)
        }
      }
    }
  }

  if (!cookies) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#E0774F' />
      </View>
    )
  }

  const cookieString = cookies.join('; ')

  return (
    <View style={styles.container}>
      {loading && (
        <Image
          source={require('./assets/Walk.gif')} // Path to your GIF file
          style={styles.loadingGif}
        />
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://juniperp.com/web/login' }}
        injectedJavaScript={`document.cookie="${cookieString}";`}
        onLoadEnd={handleWebViewLoadEnd}
        onError={handleWebViewError}
        style={styles.webview}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingGif: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
    width: 100,
    height: 100,
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
})

export default WebViewScreen
