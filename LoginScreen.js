import React, { useState } from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginScreen = () => {
  const [username, setUsername] = useState('moibi.idris@juniperp.com')
  const [password, setPassword] = useState('Anonymous12345')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigation = useNavigation()

  const handleLogin = async () => {
    setLoading(true)

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
        const cookies = setCookieHeader.map((cookie) => cookie.split(';')[0])
        const sessionId = cookies
          .find((cookie) => cookie.startsWith('session_id'))
          .split('=')[1]

        await AsyncStorage.setItem('cookies', JSON.stringify(cookies))

        // Navigate to WebViewScreen
        navigation.navigate('WebView')
      } else {
        setError('Login failed: No session ID returned.')
      }
    } catch (err) {
      console.error('An error occurred during login:', err)
      setError('An error occurred during login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingTitle}>
        <Image
          source={require('./assets/assets/jun-logo-dark.png')} // Path to your logo file
          style={styles.image}
        />
      </View>

      {loading ? (
        <Image
          source={require('./assets/Walk.gif')} // Path to your GIF file
          style={styles.loadingGif}
        />
      ) : (
        <View style={styles.allInputContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Username'
              value={username}
              onChangeText={setUsername}
              placeholderTextColor='#E0774F'
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor='#E0774F'
            />
          </View>
          <Button title='Login' onPress={handleLogin} color='#E0774F' />
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0774F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  headingTitle: {
    marginBottom: 30,
    width: '80%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  allInputContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#E0774F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  loadingGif: {
    width: 100,
    height: 100,
  },
})

export default LoginScreen
