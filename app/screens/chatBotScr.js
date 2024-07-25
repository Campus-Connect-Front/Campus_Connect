import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const ChatBotScreen = ({ route }) => {
  const navigation = useNavigation();

  const initialMessages = [
    { id: '1', text: '안녕하세요! 무엇을 도와드릴까요?', isMine: false },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');

  const botResponses = {
    '안녕하세요': '안녕하세요! 무엇을 도와드릴까요?',
    '최근 학교 공지': '최근 학교 공지는 다음과 같습니다: ...',
    '수강신청 알림': '수강신청 알림입니다: ...',
    '기본': '죄송해요, 잘 이해하지 못했습니다. 다른 질문을 해주세요.',
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: (messages.length + 1).toString(),
        text: inputMessage,
        isMine: true
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);

      const botMessage = {
        id: (messages.length + 2).toString(),
        text: botResponses[inputMessage.trim()] || botResponses['기본'],
        isMine: false
      };

      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }, 1000); // 챗봇 응답 딜레이 1초

      setInputMessage('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isMine ? styles.myMessageContainer : styles.otherMessageContainer]}>
      {!item.isMine && <Image source={require('../assets/circle_logo.png')} style={styles.profileImage} />}
      {!item.isMine && <Text style={styles.botName}>챗봇</Text>}
      <View>
        <View style={[styles.bubbleContainer, item.isMine ? styles.myBubbleContainer : styles.otherBubbleContainer]}>
          <View style={[styles.bubble, item.isMine ? styles.myBubble : styles.otherBubble]}>
            <Text style={item.isMine ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
          </View>
        </View>
        {!item.isMine && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={() => setInputMessage('최근 학교 공지')}>
              <Text style={styles.optionButtonText}>최근 학교 공지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => setInputMessage('수강신청 알림')}>
              <Text style={styles.optionButtonText}>수강신청 알림</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      // 화면이 포커스될 때 실행되는 코드
      return () => {
        // 화면이 블러될 때 실행되는 코드 (기록 초기화)
        setMessages(initialMessages);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/Logo_ver2.png')} 
        style={styles.logo} 
      />
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />
      <View style={styles.inputContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',  
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 50,
    marginBottom: 20,  
    resizeMode: 'contain',
  },
  chatList: {
    flex: 1,
    width: '100%',  
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
    marginLeft: -30,
    marginBottom: 10,
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
    marginRight: 5,
    marginBottom: 100,  
  },
  botName: {
    fontSize: 14,
    color: '#000',
    alignSelf: 'center',
    marginLeft: 0,
    marginBottom: 110,  
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    width: '100%',  
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#5678F0',
    borderWidth: 1,
    padding: 5,
    marginHorizontal: 5,
    marginLeft: -30,
  },
  optionButtonText: {
    color: '#5678F0',
  },
});
