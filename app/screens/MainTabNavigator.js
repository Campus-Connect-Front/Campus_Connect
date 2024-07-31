import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import ChatBotScreen from './screens/chatBotScr';
import StudyGroupScreen from './screens/StudyGroupScreen';
import ChatScreen from './screens/matchingScr';
import ChatListScreen from './screens/chatListScr';
import MyPageStackNavigator from './screens/MyPageStackNavigator'; 

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="ChatBot"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'ChatBot') {
            iconSource = require('./assets/Chatbot.png');
          } else if (route.name === 'StudyGroup') {
            iconSource = require('./assets/StudyGroup.png');
          } else if (route.name === 'Chat') {
            iconSource = require('./assets/Chat.png');
          } else if (route.name === 'ChatList') {
            iconSource = require('./assets/ChatList.png');
          } else if (route.name === 'MyPage') {
            return (
              <Image
                source={require('./assets/default-profile.png')} // 프로필 이미지 파일 경로
                style={styles.profileImage}
              />
            );
          }

          return (
            <Image
              source={iconSource}
              style={[styles.tabIcon, { width: size, height: size }]}
              resizeMode="contain"
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#5678F0',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="ChatBot" component={ChatBotScreen} />
      <Tab.Screen name="StudyGroup" component={StudyGroupScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="ChatList" component={ChatListScreen} />
      <Tab.Screen name="MyPage" component={MyPageStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    tintColor: '#000', // 기본 색상, 필요에 따라 수정
  },
  profileImage: {
    width: 20, // 아이콘의 크기
    height: 20,
    borderRadius: 20, // 원형으로 만들기
    borderWidth: 2,
    borderColor: '#E0E0E0', // 원형 테두리 색상
  },
});
