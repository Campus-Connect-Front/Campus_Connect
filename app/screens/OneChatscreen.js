import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { ReportScr } from './reportScr';
import { ExitModal } from './exitModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../config'
// WebSocket 설정
import SockJS from 'sockjs-client';
import StompJs, {Client} from '@stomp/stompjs';
import * as encoding from 'text-encoding';

export const OneChatScreen = ({ route }) => {
  const { chatName, roomId, userId } = route.params;
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
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
    const socket = new SockJS("http://192.168.45.75:8090/stomp/chat");
    const stomp = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        userId: userId, // 실제 userId를 사용
        roomId: roomId, // 실제 roomId를 사용
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000, // 자동 재 연결
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  
    stomp.onConnect = () => {
      console.log('Connected');
      setConnected(true); // 연결 완료 상태로 업데이트
      // 저장된 채팅 불러오기
      fetch(`${API.CHAT}/room/${roomId}`)
        .then(response => {
          console.log('Content-Type:', response.headers.get('Content-Type'));
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // 응답을 JSON으로 읽기
        })
        .then(data => {
          console.log('Fetched data:', data);
          setMessages(data);
        })
        .catch(error => {
          console.error('Error fetching messages: ', error);
          Alert.alert('Error', '메시지 로딩 중 오류가 발생했습니다.');
        });
  
      // 구독
      stomp.subscribe(`/sub/chat/room/${roomId}`, (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);
          const formattedMessage = {
            id: receivedMessage.id,
            messageContent: receivedMessage.messageContent,
            timestamp: new Date(receivedMessage.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            isMine: receivedMessage.senderId === userId, // 메시지의 발신자가 현재 사용자 ID와 일치하는지 확인
            system: receivedMessage.messageType === 'ENTER' || receivedMessage.messageType === 'LEAVE',
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
          roomId: roomId,
          userId: userId,
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
      if (stomp) {
        try {
          stomp.publish({
            destination: '/pub/chat/exit',
            body: JSON.stringify({
              roomId: roomId,
              userId: userId,
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
  }, [roomId, userId]);

  

  useLayoutEffect(() => {
    navigation.setOptions({
      title: chatName,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="report-gmailerrorred"
            size={25}
            color="black"
            containerStyle={{ marginRight: 10 }}
            onPress={() => setIsReportModalVisible(true)}
          />
          <Icon
            name="logout"
            size={25}
            color="black"
            containerStyle={{ marginLeft: 10 }}
            onPress={() => setIsExitModalVisible(true)}
          />
        </View>
      ),
    });
  }, [navigation, chatName]);

  const renderItem = ({ item, index }) => {
    if (item.messageType === 'ENTER' || item.messageType === 'LEAVE') {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.messageContent}</Text>
        </View>
      );
    }
  
    return (
      <View style={[styles.messageContainer, item.isMine ? styles.myMessageContainer : styles.otherMessageContainer]}>
        {!item.isMine && (
          <>
            <Image source={require('../assets/circle_logo.png')} style={styles.profileImage} />
            <Text style={styles.senderName}>{item.senderName}</Text>
          </>
        )}
        <View>
          <View style={[styles.bubbleContainer, item.isMine ? styles.myBubbleContainer : styles.otherBubbleContainer]}>
            <View style={[styles.bubble, item.isMine ? styles.myBubble : styles.otherBubble]}>
              <Text style={item.isMine ? styles.myMessageText : styles.otherMessageText}>{item.messageContent}</Text>
            </View>
          </View>
          <Text style={item.isMine ? styles.myMessageTime : styles.otherMessageTime}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };
  
  

  const handleSend = () => {
    if (stompClient && stompClient.connected) {
      const newMessage = {
        roomId: roomId,
        userId: userId,
        messageContent: inputMessage,
        messageType: 'TALK',
        timestamp: new Date().toISOString(),

      };
      try {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: `${Date.now()}`,
            messageContent: inputMessage,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            isMine: true, 
          }
        ]);      

        setInputMessage('');
      } catch (error) {
        console.error('Message sending error: ', error);
        Alert.alert('Error', 'An error occurred while sending the message.');
      }
    }
  };

  const handleReportSubmit = (reportText) => {
    console.log(reportText);
    setIsReportModalVisible(false);
  };

  const handleExit = async () => {
    setIsExitModalVisible(false);
    // 탈퇴로직
    const token = await AsyncStorage.getItem('token');
    const roomId = roomId; // 입장해있는 채팅방 roomId 가져오기
     
    fetch(`${API.CHAT}/room/${roomId}`,{
      method: 'DELETE',
      headers:{
        'Content-type':'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if(response.ok){
        console.log('탈퇴 성공');
      }else{
        console.error('탈퇴 실패');
        Alert.alert('탈퇴에 실패했습니다');
      }
    })
    .catch(error=>{
      console.error('탈퇴 실패', error);
        Alert.alert('탈퇴에 실패했습니다');
    })
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsEmojiPickerVisible(false)}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={80}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.chatList}
          contentContainerStyle={{ paddingTop: 20 }}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
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
            onFocus={() => flatListRef.current.scrollToEnd({ animated: true })}
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEDF6',
  },
  chatList: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end', // 오른쪽 정렬
    paddingRight: 10,
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start', // 왼쪽 정렬
    paddingLeft: 10,
  },
  bubbleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
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
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  systemMessageText: {
    color: '#888',
    fontSize: 12,
  },
});
