import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/login';
import Register from './src/screens/register';
import ForgotPassword from './src/screens/ForgotPassword';
import MainTabs from './src/screens/MainTabs';  // corrigido aqui

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Login" component={Login} />
          <RootStack.Screen name="Register" component={Register} />
          <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        </RootStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
