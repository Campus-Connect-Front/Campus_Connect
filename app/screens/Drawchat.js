import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OneChatScreen } from './OneChatscreen';
import { GroupChatScreen } from './GroupChatscreen';

const Drawer = createDrawerNavigator();

const GroupChatWithDrawerButton = ({ navigation, route }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 18 }}>{route.params?.chatName || 'Group Chat'}</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <GroupChatScreen />
    </View>
  );
};

export const Drawchat = () => {
  return (
    <Drawer.Navigator
      drawerPosition='right' // 오른쪽에서 열리도록 설정
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="OneChat" component={OneChatScreen} />
      <Drawer.Screen name="GroupChat" component={GroupChatWithDrawerButton} />
    </Drawer.Navigator>
  );
};
