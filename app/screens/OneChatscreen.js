import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-elements'; 
import { useNavigation } from '@react-navigation/native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { ReportScr } from './reportScr';
import { ExitModal } from './exitModal';

export const OneChatScreen = ({ route }) => {
  const { chatName } = route.params;
  const navigation = useNavigation();

  const [messages, setMessages] = useState([
    { id: '1', text: '안녕하세요!', isMine: false, time: '오전 10:00' },
    { id: '2', text: '안녕하세요! 반갑습니다.', isMine: true, time: '오전 10:01' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: chatName,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon 
            name="report" 
            size={25} 
            color="black" 
            containerStyle={{ marginRight: 10 }} 
            onPress={() => setIsReportModalVisible(true)} 
          />
          <Icon 
            name="exit-to-app" 
            size={25} 
            color="black" 
            containerStyle={{ marginLeft: 10 }} 
            onPress={() => setIsExitModalVisible(true)} 
          />
        </View>
      ),
    });
  }, [navigation, chatName]);

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isMine ? styles.myMessageContainer : styles.otherMessageContainer]}>
      {!item.isMine && <Image source={require('../assets/circle_logo.png')} style={styles.profileImage} />}
      <View>
        <View style={[styles.bubbleContainer, item.isMine ? styles.myBubbleContainer : styles.otherBubbleContainer]}>
          <View style={[styles.bubble, item.isMine ? styles.myBubble : styles.otherBubble]}>
            <Text style={item.isMine ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
          </View>
          <Text style={item.isMine ? styles.myMessageTime : styles.otherMessageTime}>{item.time}</Text>
        </View>
      </View>
    </View>
  );

  const handleSend = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: inputMessage,
        isMine: true,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  const handleReportSubmit = (reportText) => {
    console.log(reportText);
    setIsReportModalVisible(false);
  };

  const handleExit = () => {
    setIsExitModalVisible(false);
    // 탈퇴로직
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />
      {isEmojiPickerVisible && (
        <EmojiSelector
          category={Categories.ALL}
          onEmojiSelected={emoji => setInputMessage(inputMessage + emoji)}
          showSearchBar={false}
          columns={8}
        />
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}>
          <Icon
            name="emoji-emotions"
            type="material"
            color="#7F9AF5"
            size={24}
            style={styles.emojiButton}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon
            name="send"
            type="material"
            color="#7F9AF5"
            size={24}
          />
        </TouchableOpacity>
      </View>
      <ReportScr
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        onSubmit={handleReportSubmit}
      />
      <ExitModal
        visible={isExitModalVisible}
        onClose={() => setIsExitModalVisible(false)}
        onExit={handleExit}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  chatList: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  bubbleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 10,
  },
  myBubble: {
    backgroundColor: '#5678F0',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#BDD7FF',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',  
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButton: {
    marginRight: 10,
  },
  myMessageTime: {
    color: '#9291A6',
    fontSize: 10,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  otherMessageTime: {
    color: '#9291A6',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
});
