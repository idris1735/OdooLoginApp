// AppNavigator.js
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from './LoginScreen'
import WebViewScreen from './WebViewScreen'

const Stack = createStackNavigator()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name='WebView'
          options={{ headerShown: false }}
          component={WebViewScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
