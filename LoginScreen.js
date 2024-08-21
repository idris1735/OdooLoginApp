import React, { useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet } from 'react-native'
import OdooJSONRpc from '@fernandoslim/odoo-jsonrpc'

const LoginScreen = () => {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('P@55Word')
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    const odoo = new OdooJSONRpc({
      odoo_url: 'https://juniperp.com', // Replace with your Odoo URL
      db: 'juniperp.com', // Replace with your database name
      username: username,
      password: password,
    })

    try {
      const response = await odoo.connect()
      if (response.uid) {
        console.log('Login successful!', response)
        setError(null)
      } else {
        setError('Login failed: Invalid credentials.')
      }
    } catch (err) {
      console.error('An error occurred during login:', err)
      setError('An error occurred during login.')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Username'
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title='Login' onPress={handleLogin} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
})

export default LoginScreen
