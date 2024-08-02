import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const ChatBotScreen = ({ route }) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

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

  const handleSend = (messageText) => {
    if (messageText.trim()) {
      const userMessage = {
        id: (messages.length + 1).toString(),
        text: messageText,
        isMine: true
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);

      const botMessage = {
        id: (messages.length + 2).toString(),
        text: botResponses[messageText.trim()] || botResponses['기본'],
        isMine: false
      };

      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, botMessage]);
        flatListRef.current.scrollToEnd({ animated: true });
      }, 1000); // 챗봇 응답 딜레이 1초

      setInputMessage('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isMine ? styles.myMessageContainer : styles.otherMessageContainer]}>
      {!item.isMine && (
        <View style={styles.botContainer}>
          <Image source={require('../assets/circle_logo.png')} style={styles.profileImage} />
          <Text style={styles.botName}>챗봇</Text>
        </View>
      )}
      <View style={styles.bubbleWrapper}>
        <View style={[styles.bubbleContainer, item.isMine ? styles.myBubbleContainer : styles.otherBubbleContainer]}>
          <View style={[styles.bubble, item.isMine ? styles.myBubble : styles.otherBubble]}>
            <Text style={item.isMine ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
          </View>
        </View>
        {!item.isMine && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleSend('최근 학교 공지')}>
              <Text style={styles.optionButtonText}>최근 학교 공지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleSend('수강신청 알림')}>
              <Text style={styles.optionButtonText}>수강신청 알림</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // 새로 들어갈 때마다 기록 초기화
        setMessages(initialMessages);
      };
    }, [])
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
      <Image
        source={require('../assets/Logo_ver2.png')}
        style={styles.logo}
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요."
          value={inputMessage}
          onChangeText={setInputMessage}
          onFocus={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSend(inputMessage)}>
          <Icon
            name="send"
            type="material"
            color="#7F9AF5"
            size={24}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEDF6',
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
    alignItems: 'flex-start',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  botContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 5,
  },
  bubbleWrapper: {
    flexDirection: 'column',
    flex: 1,
  },
  bubbleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  myBubbleContainer: {
    alignItems: 'flex-end',
  },
  otherBubbleContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%', 
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
  },
  botName: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
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
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#5678F0',
    borderWidth: 1,
    padding: 5,
    marginHorizontal: 5, 
  },
  optionButtonText: {
    color: '#5678F0',
  },
});
