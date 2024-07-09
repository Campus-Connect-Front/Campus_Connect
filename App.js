import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatBotScreen } from './app/screens/chatBotScr';
import { BoardScreen } from './app/screens/boardScr';
import { ChatListScreen } from './app/screens/chatListScr';
import { MatchingScreen } from './app/screens/matchingScr';
import { MyPageScreen } from './app/screens/myPageScr';
import { OneChatScreen } from './app/screens/OneChatscreen';
import { GroupChatScreen } from './app/screens/GroupChatscreen';
import { Drawchat } from './app/screens/Drawchat';

import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TempSplashScreen = () => {
  return (
    <View>
      <Text>Splash Screen</Text>
    </View>
  )
}

const TempLoginScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => navigation.replace('Main')}
        style={{ backgroundColor: '#5678F0', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 7 }}>
        <Text style={{ color: '#ffffff' }}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen options={{ headerShown: false }} name='ChatBot' component={ChatBotScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Board" component={BoardScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Matching" component={MatchingScreen} />
      <Tab.Screen options={{ headerShown: false }} name="ChatList" component={ChatListScreen} />
      <Tab.Screen options={{ headerShown: false }} name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name='Splash'
          component={TempSplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Login'
          component={TempLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Main'
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='OneChat'
          component={OneChatScreen}
          options={({ route }) => ({
            title: route.params.chatName,
            headerRight: () => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Icon name="report" size={25} color="black" style={{ marginRight: 15 }} />
                <Icon name="exit-to-app" size={25} color="black" />
              </View>
            )
          })}
        />
        <Stack.Screen
          name='GroupChat'
          component={GroupChatScreen}
          options={({ route }) => ({
            title: route.params.chatName,
            headerRight: () => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Icon name="menu" size={25} color="black" style={{ marginRight: 15 }} />                
              </View>
            )
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
