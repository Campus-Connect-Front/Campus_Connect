import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyPageScreen from './screens/MyPageScreen';
import EditMyInfoScreen from './screens/EditMyInfoScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import MyInfoScreen from './screens/MyInfoScreen'; 

const Stack = createStackNavigator();

export default function MyPageStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="MyPage">
      <Stack.Screen name="MyPage" component={MyPageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditMyInfo" component={EditMyInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MyInfo" component={MyInfoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
