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
  console.log('Route Params:', route.params);
  const chatName = params.chatName || '채팅방';
  //const userName = params.userName || '수정이';
  const { roomId, userId: initialUserId } = route.params; // 초기 userId를 받기 위해 변경
  const [userId, setUserId] = useState(initialUserId); 
  const [nickname, setNickname] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [participants, setParticipants] = useState(initialParticipants);
  const [hasEntered, setHasEntered] = useState(false); // 입장 메시지가 한 번만 보내지도록 관리
  const flatListRef = useRef(null);
 
    // 프로필 이미지 상태를 관리하기 위한 상태 변수 추가
    const [otherProfileImage, setOtherProfileImage] = useState(null); // 상대방 프로필 이미지

  // WebSocket 관련 설정
  const [stompClient, setStompClient] = useState(null);
  const TextEncodingPolyfill = require('text-encoding');
  const [connected, setConnected] = useState(false);
  Object.assign('global', {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
  });

  // studentId 불러오기
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId'); // AsyncStorage에서 userId 가져오기
        setUserId(storedUserId); // userId 상태 업데이트
      } catch (error) {
        console.error('Failed to load userId from AsyncStorage:', error);
      }
    };

    loadUserId();
  }, []);

   // MyPage API에서 nickname과 profileImage 불러오기
   useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API.USER}/mypage`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const storedUserId = data.userAuthenticationDTO.studentId;
        const fetchedNickname = data.usersDTO.nickName;
        const fetchedProfileImage = `${API.USER}/images/${data.usersDTO.imgUrl}`;

        setUserId(storedUserId);
        setNickname(fetchedNickname); // nickname 설정
        setOtherProfileImage(fetchedProfileImage); // 프로필 이미지 설정

        setParticipants([
          { id: 'ME', name: fetchedNickname, profileImage: fetchedProfileImage } // 초기 참가자 설정
        ]);

        console.log('Loaded id from API:', storedUserId);
        console.log('Loaded nickname from API:', fetchedNickname);
        console.log('Loaded profile image from API:', fetchedProfileImage);

      } catch (error) {
        console.error('Failed to load user profile:', error.message);
        Alert.alert('오류', '프로필 정보를 불러오는 데 실패했습니다.');
      }
    };

    loadUserProfile();
  }, [roomId]);


  useEffect(() => {
    // 프로필 이미지를 AsyncStorage에서 불러오는 함수
    const loadProfileImages = async () => {
      try {
        const otherImage = await AsyncStorage.getItem(`profileImage-${roomId}`); // 상대방의 프로필 이미지 가져오기 (채팅방 ID 기준으로 구분)
        setOtherProfileImage(otherImage);
      } catch (error) {
        console.error('Failed to load profile images:', error);
      }
    };
    loadProfileImages(); // 컴포넌트가 마운트될 때 프로필 이미지 로드

    // sockJS 클라이언트 생성 및 websocket 연결
    const socket = new SockJS("http://192.168.45.57:8090/stomp/chat");
    const stomp = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        userId:userId,
        roomId: roomId, 
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
        .then(response => response.json())
        .then(data => {
          setMessages(data.slice(-5)); 
        })
        .catch(error => {
          console.error('Error fetching messages: ', error);
          Alert.alert('Error', '메시지 로딩 중 오류가 발생했습니다.');
        });

      // 구독
      stomp.subscribe(`/sub/chat/room/${roomId}`, (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);

          const user = receivedMessage.userId || {};
          const student = user.studentId || {};

          // 각 필드가 존재하는지 확인하고 기본값을 설정
          const senderId = receivedMessage.studentId || 'Unknown Sender';
          const id = receivedMessage.messageId || `${Date.now()}`; 
          const profileImage = receivedMessage.profileImage || profileImage;;
          const senderName = nickname || '익명';
          const timestamp = receivedMessage.sendTime 
            ? new Date(receivedMessage.sendTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) 
            : 'Invalid Date';

          const formattedMessage = {
            id: id,
            messageContent: receivedMessage.messageContent,
            timestamp:  timestamp,
            isMine: senderId === userId, 
            system: receivedMessage.messageType === 'ENTER' || receivedMessage.messageType === 'LEAVE',
            senderName: senderName,
            profileImage: profileImage,
          };

          setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        } catch (error) {
          console.error('Message processing error: ', error);
          Alert.alert('Error', 'An error occurred while processing the message.');
        }
      });
  
      // 유저 입장 메시지 발송 (최초 입장 시 한 번만)
      if (!hasEntered) {
        stomp.publish({
          destination: '/pub/chat/enter',
          body: JSON.stringify({
            roomId: roomId,
            userId: userId,
            messageType: 'ENTER'
          }),
        });
        setHasEntered(true); // 입장 메시지를 보냈음을 기록
      }
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
          stomp.deactivate();
        } catch (error) {
          console.error('Error during disconnection: ', error);
          Alert.alert('Error', 'An error occurred during disconnection.');
        }
      }
    };
  }, [roomId, userId, hasEntered,otherProfileImage]);

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
  

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      const cleanedMessage = inputText.replace(/\n/g, ''); 
      const newMessage = {
        roomId: roomId,
        studentId: userId,
        senderId: userId,
        messageContent: cleanedMessage,
        messageType: 'TALK',
        timestamp: new Date().toISOString(),
      };
      try {
        stompClient.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify(newMessage),
        });
  
        setInputText(''); 
      } catch (error) {
        console.error('Message sending error: ', error);
        Alert.alert('Error', 'An error occurred while sending the message.');
      }
    } else {
      Alert.alert('Error', 'WebSocket is not connected.');
    }
  };

  //handleExit 함수 
  const handleExit = async () => {
    setIsModalVisible(false); 
    const token = await AsyncStorage.getItem('token');
     
    fetch(`${API.CHAT}/room/${roomId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        console.log('탈퇴 성공');
        stompClient.publish({
          destination: '/pub/chat/exit',
          body: JSON.stringify({
            roomId: roomId,
            userId: userId,
            messageType: 'LEAVE'
          }),
        });
        navigation.goBack(); // 채팅방에서 나가기
      } else {
        console.error('탈퇴 실패');
        Alert.alert('탈퇴에 실패했습니다');
      }
    })
    .catch(error => {
      console.error('탈퇴 실패', error);
      Alert.alert('탈퇴에 실패했습니다');
    });
  };
  
  const renderItem = ({ item }) => {
    if (!item) {
      return null;
    }
  
    // 기존 코드
    if (item.messageType === 'ENTER' || item.messageType === 'LEAVE') {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.messageContent}</Text>
        </View>
      );
    }
  
    return (
      <View style={item.isMine ? styles.myMessageContainer : styles.otherMessageContainer}>
        {!item.isMine && (
          <>
            <Image
              source={item.profileImage = require('../assets/circle_logo.png')}
              style={styles.profileImage}
            />
          </>
        )}
        <View style={styles.messageContentContainer}>
          {!item.isMine && <Text style={styles.senderName}>{nickname || '익명'}</Text>}
          <View style={item.isMine ? styles.myBubbleContainer : styles.otherBubbleContainer}>
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
        data={messages.filter(Boolean)}
        renderItem={renderItem}
        keyExtractor={(item) => item ? item.id : Math.random().toString()} 
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
          multiline={false} 
          blurOnSubmit={true}
          autoCorrect={false}
          autoCapitalize="none"
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
        userName={nickname}
        onExit={handleExit} 
      />
    </KeyboardAvoidingView>
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
    marginTop: 20,
    marginVertical: 5,
    alignItems: 'flex-start',
  },
  myMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end', // 오른쪽 정렬
    paddingRight: 10,
  },
  otherMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start', // 왼쪽 정렬
    marginTop: 20,
    paddingLeft: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContentContainer: {
    flexDirection: 'column',
    maxWidth: '80%', // 메시지 최대 너비 설정
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bubbleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 10,
    borderRadius: 10,
  },
  myBubbleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  otherBubbleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  myBubble: {
    backgroundColor: '#5678F0',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#BDD7FF',
    borderTopLeftRadius: 0,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
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
    alignSelf: 'flex-start',
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
});

export default GroupChatScreen;
