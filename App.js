import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatBotScreen } from './app/screens/chatBotScr';
import { BoardScreen, BoardSearchPage } from './app/screens/boardScr';
import { ChatListScreen } from './app/screens/chatListScr';
import { MatchingScreen } from './app/screens/matchingScr';
import MyPageScreen from './app/screens/MyPageScreen';
import { OneChatScreen } from './app/screens/OneChatscreen';
import { GroupChatScreen } from './app/screens/GroupChatscreen';
import { BoardDetailScreen } from './app/screens/boardDetailScr';
import { BoardWriteScreen } from './app/screens/boardWriteScr';
import EditMyInfoScreen from './app/screens/EditMyInfoScreen';
import EditProfileScreen from './app/screens/EditProfileScreen';
import MyInfoScreen from './app/screens/MyInfoScreen';
import LoginScreen from './app/screens/LoginScreen';
import SignupScreen from './app/screens/SignupScreen';
import VerificationScreen from './app/screens/VerificationScreen';
import AdditionalInfoScreen from './app/screens/AdditionalInfoScreen';
import { MaterialCommunityIcons, Ionicons, Entypo, FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TempSplashScreen = () => {
  return (
    <View>
      <Text>Splash Screen</Text>
    </View>
  );
};

const MyPageStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MyPage">
      <Stack.Screen  name="MyPage" component={MyPageScreen} options={{ title: '마이페이지' }}/>
      <Stack.Screen name="EditMyInfo" component={EditMyInfoScreen} options={({ navigation }) => ({
        title: 'MyInfo 수정',
        headerLeft: () => (
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('MyPage')}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        ),
      })} 
      />
      <Stack.Screen name="MyInfo" component={MyInfoScreen} options={({ navigation }) => ({
          title: '내 정보',
          headerLeft: () => (
          <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('MyPage')}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          ),
        })} 
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={({ navigation }) => ({
        title: '정보 변경', headerLeft: () => (
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.navigate('MyInfo')}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        ),
        })} 
      /> 
    </Stack.Navigator>
  );
};

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const MainTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator initialRouteName='Matching' screenOptions={{ tabBarShowLabel: false }}>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons name="robot" size={size} color={focused ? '#5678F0' : '#787878'} />
          )
        }}
        name='ChatBot' component={ChatBotScreen} />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome5 name="book" size={size} color={focused ? '#5678F0' : '#787878'} />
          )
        }}
        name="Board">{() => (<BoardScreen parentNav={navigation} />)}</Tab.Screen>      
     <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ marginTop: 10 }}
              source={
                focused ? require('../Campus_Connect/app/assets/images/circle_logo_mini.png')
                  : require('../Campus_Connect/app/assets/images/circle_logo_mini.png')} />
          )
        }}
        name="Matching" component={MatchingScreen} />
        
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Entypo name="chat" size={size} color={focused ? '#5678F0' : '#787878'} />
          )
        }}
        name="ChatList" component={ChatListScreen} />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name="person" size={size} color={focused ? '#5678F0' : '#787878'} />
          )
        }}
        name="MyPage" component={MyPageStackNavigator} />
    </Tab.Navigator>
  );
};

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
          component={LoginStackNavigator}
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
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name='GroupChat'
          component={GroupChatScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name='BoardDetail'
          component={BoardDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='BoardWrite'
          component={BoardWriteScreen}
        />
        <Stack.Screen
          name='BoardSearch'
          component={BoardSearchPage}
        />
        <Stack.Screen
          name='matchingScr'  
          component={MatchingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#5678F0',
    resizeMode: 'contain', 
  },
});
