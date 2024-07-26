import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import VerificationScreen from './screens/VerificationScreen';
import AdditionalInfoScreen from './screens/AdditionalInfoScreen';

const Stack = createStackNavigator();

export default function LoginStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
