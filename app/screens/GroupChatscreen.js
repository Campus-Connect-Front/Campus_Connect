import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import ParticipantModal from './ParticipantModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../config';
// WebSocket 설정
import SockJS from 'sockjs-client';
import StompJs, { Client } from '@stomp/stompjs';
import * as encoding from 'text-encoding';

const initialMessages = [];
const initialParticipants = [];

export const GroupChatScreen = ({ route = {}, navigation }) => {
  const { params = {} } = route;
  const chatName = params.chatName || '채팅방';
  const userName = params.userName || '수정이';
  const { roomId, userId } = route.params;
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [participants, setParticipants] = useState([...initialParticipants, { id: 'ME', name: userName, profileImage: require('../assets/circle_logo.png') }]);
  const flatListRef = useRef(null);

  // WebSocket 관련 설정
  const [stompClient, setStompClient] = useState(null);
  const TextEncodingPolyfill = require('text-encoding');
  const [connected, setConnected] = useState(false);
  Object.assign('global', {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
  });

  // sockJS 클라이언트 생성 및 websocket 연결
  useEffect(() => {
    try {
      const socket = new SockJS("http://192.168.45.75:8090/stomp/chat");
      const stomp = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          userId: 'userId',
          roomId: 'roomId',
        },
        debug: (str) => {
          console.log(str)
        },
        reconnectDelay: 5000, // 자동 재 연결
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stomp.onConnect = () => {
        console.log('Connected');
        setConnected(true); // 연결 완료 상태로 업데이트
        // 저장된 채팅 불러오기
        fetch(`${API.CHAT}/room/10`)
          .then(response => {
            console.log('Content-Type:', response.headers.get('Content-Type'));
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // 응답을 텍스트로 읽기
          })
          .then(text => {
            console.log('Fetched response text:', text); // 응답 본문 로그
            try {
              const data = JSON.parse(text); // JSON으로 파싱 시도
              console.log('Parsed data:', data);
              setMessages(data);
            } catch (error) {
              console.error('Error parsing JSON:', error);
              Alert.alert('Error', 'JSON 파싱 중 오류가 발생했습니다.');
            }
          })
          .catch(error => {
            console.error('Error fetching messages: ', error);
            Alert.alert('Error', '메시지 로딩 중 오류가 발생했습니다.');
          });

        // 구독
        stomp.subscribe(`/sub/chat/room/10`, (message) => {
          try {
            const receivedMessage = JSON.parse(message.body);
            // 화면에 뿌릴 내용
            const formattedMessage = {
              id: receivedMessage.id,
              messageContent: receivedMessage.messageContent,
              timestamp: new Date(receivedMessage.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              isMine: receivedMessage.senderId === userId, // 메시지의 발신자가 현재 사용자 ID와 일치하는지 확인
            };
            setMessages((prevMessages) => [...prevMessages, formattedMessage]);
          } catch (error) {
            console.error('Message processing error: ', error);
            Alert.alert('Error', 'An error occurred while processing the message.');
          }
        });

        // 유저 입장 메시지 발송
        stomp.publish({
          destination: '/pub/chat/enter',
          body: JSON.stringify({
            roomId: 10,
            userId: 3,
            messageType: 'ENTER'
          }),
        });
      };

      stomp.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        Alert.alert('Error', 'A connection error occurred.');
      };

      setStompClient(stomp);
      stomp.activate();

      return () => {
        // 컴포넌트 언마운트 시 연결 해제 및 유저 퇴장 메시지 발송
        if (stomp) {
          try {
            stomp.publish({
              destination: '/pub/chat/exit',
              body: JSON.stringify({
                roomId: 10,
                userId: 3,
                messageType: 'LEAVE'
              }),
            });
            stomp.deactivate();
          } catch (error) {
            console.error('Error during disconnection: ', error);
            Alert.alert('Error', 'An error occurred during disconnection.');
          }
        }
      };
    } catch (error) {
      console.error('WebSocket connection error: ', error);
      Alert.alert('Error', 'An error occurred during WebSocket connection.');
    }
  }, [roomId, userId]);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: chatName,
      headerRight: () => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Icon
            name="menu"
            size={25}
            color="black"
            style={{ marginRight: 15 }}
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      ),
    });
  }, [navigation, chatName]);

  useEffect(() => {
    const entryMessageId = `system-entry-${Date.now()}`;
    const exitMessageId = `system-exit-${Date.now() + 1}`; // +1 to ensure different id

    // 사용자 입장 메시지 추가
    const entryMessage = {
      id: entryMessageId,
      text: `${userName}님이 입장했습니다.`,
      system: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prevMessages => [...prevMessages, entryMessage]);
    flatListRef.current.scrollToEnd({ animated: true });

    // 사용자 퇴장 메시지 추가
    return () => {
      const exitMessage = {
        id: exitMessageId,
        text: `${userName}님이 퇴장했습니다.`,
        system: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prevMessages => [...prevMessages, exitMessage]);
    };
  }, [userName]);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      const newMessage = {
        roomId: 10,
        userId: 3,
        messageContent: inputText,
        messageType: 'TALK'
      };
      try {
        stompClient.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify(newMessage)
        });
        setInputText('');
      } catch (error) {
        console.error('Message sending error: ', error);
        Alert.alert('Error', 'An error occurred while sending the message.');
      }
    }
  };

  const renderItem = ({ item }) => {
    if (item.system) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, item.isMine ? styles.myMessageContainer : styles.otherMessageContainer]}>
        {!item.isMine && <Image source={require('../assets/circle_logo.png')} style={styles.profileImage} />}
        <View>
          {!item.isMine && <Text style={styles.senderName}>{item.sender}</Text>}
          <View style={[styles.bubbleContainer, item.isMine ? styles.myBubbleContainer : styles.otherBubbleContainer]}>
            <View style={[styles.bubble, item.isMine ? styles.myBubble : styles.otherBubble]}>
              <Text style={item.isMine ? styles.myMessageText : styles.otherMessageText}>{item.messageContent}</Text>
            </View>
            <Text style={item.isMine ? styles.myMessageTime : styles.otherMessageTime}>{item.timestamp}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      {isEmojiPickerVisible && (
        <EmojiSelector
          category={Categories.ALL}
          onEmojiSelected={emoji => setInputText(inputText + emoji)}
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
          value={inputText}
          onChangeText={setInputText}
          onFocus={() => flatListRef.current.scrollToEnd({ animated: true })}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon
            name="send"
            type="material"
            color="#7F9AF5"
            size={24}
          />
        </TouchableOpacity>
      </View>
      <ParticipantModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        participants={participants}
        userName={userName}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEDF6',
    paddingTop: 20,
  },
  chatName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
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
    alignSelf: 'flex-end',
    paddingRight: 10,
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    paddingLeft: 10,
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
  senderName: {
    color: '#9291A6',
    fontSize: 12,
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
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
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  systemMessageText: {
    color: '#9291A6',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default GroupChatScreen;
