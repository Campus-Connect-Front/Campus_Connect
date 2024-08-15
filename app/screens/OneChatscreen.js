import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { ReportScr } from './reportScr';
import { ExitModal } from './exitModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../config'
// WebSocket 설정
import SockJS from 'sockjs-client';
import StompJs, { Client } from '@stomp/stompjs';
import * as encoding from 'text-encoding';

export const OneChatScreen = ({ route }) => {
  const { chatName, roomId } = route.params;
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
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

  // studentId 불러오기 및 nickname 가져오기
  const [profileImageUri, setProfileImageUri] = useState('');

useEffect(() => {
    const loadUserProfile = async () => {
        const userToken = await AsyncStorage.getItem('userToken');

        try {
            const response = await fetch(`${API.USER}/mypage`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`네트워크 응답이 올바르지 않습니다: ${errorData}`);
            }

            const data = await response.json();
            const fetchedProfileImageUri = `${API.USER}/images/${data.usersDTO.imgUrl}?${new Date().getTime()}`;

            // 상태 업데이트
            setUserId(data.userAuthenticationDTO.studentId);
            setNickname(data.usersDTO.nickName);
            setProfileImageUri(fetchedProfileImageUri);

            console.log('프로필 정보 로드 성공:', {
                id: data.userAuthenticationDTO.studentId,
                nickname: data.usersDTO.nickName,
                profileImageUri: fetchedProfileImageUri,
            });

        } catch (error) {
            const errorMessage = error?.message || '알 수 없는 오류가 발생했습니다';
            console.error('프로필 정보를 불러오는 데 실패했습니다:', errorMessage);
            Alert.alert('오류', `프로필 정보를 불러오는 데 실패했습니다: ${errorMessage}`);
        }
    };

    loadUserProfile();
}, []);





  useEffect(() => {

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
          setMessages(data.slice(-3)); 
        })
        .catch(error => {
          console.error('Error fetching messages: ', error);
          Alert.alert('Error', '메시지 로딩 중 오류가 발생했습니다.');
        });


       // 구독
       stomp.subscribe(`/sub/chat/room/${roomId}`, (message) => {
        try {
          const receivedMessage = JSON.parse(message.body);
          //console.log('Received raw message:', receivedMessage);
          
          const user = receivedMessage.userId || {};
          const student = user.studentId || {};
          //console.log('NickName in received message:', user.nickName);


          // 각 필드가 존재하는지 확인하고 기본값을 설정
          const senderId = receivedMessage.studentId || 'Unknown Sender';
          const id = receivedMessage.messageId || `${Date.now()}`; 
          const profileImageUri = profileImageUri;
          const senderName = nickname || '익명';
          const timestamp = receivedMessage.sendTime 
            ? new Date(receivedMessage.sendTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) 
            : 'Invalid Date';
      
          const formattedMessage = {
            id: id,
            messageContent: receivedMessage.messageContent,
            timestamp: timestamp,
            isMine: senderId === userId,
            senderName: senderName,
            profileImage: profileImage,
            senderId: senderId
          };
          //console.log('Formatted message:', formattedMessage);      
          setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        } catch (error) {
          console.error('Message processing error: ', error);
          Alert.alert('Error', 'An error occurred while processing the message.');
        }
      });
      
      // 유저 최초 입장 메시지 발송 (최초에만 보내기 위해 useEffect에서 설정)
      stomp.publish({
        destination: '/pub/chat/enter',
        body: JSON.stringify({
          roomId: roomId,
          userId: userId,
          messageType: 'ENTER',
          senderName: nickname
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
          stomp.deactivate();
        } catch (error) {
          console.error('Error during disconnection: ', error);
          Alert.alert('Error', 'An error occurred during disconnection.');
        }
      }
    };
  }, [roomId, userId, profileImageUri]); // 상대방의 프로필 이미지 상태를 의존성에 추가

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

  const renderItem = ({ item }) => {
    // 시스템 메시지 처리
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
              source={profileImage ? { uri: profileImage } : require('../assets/circle_logo.png')}
              style={styles.profileImage}
              onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}
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
  

  const handleSend = () => {
    if (stompClient && stompClient.connected) {
      if (!userId) {
        console.error('User ID is not set.');
        Alert.alert('Error', '사용자 ID가 설정되지 않았습니다.');
        return;
      }
      else{console.log(userId);}
      console.log('Sending message as:', nickname);
      const newMessage = {
        roomId: roomId,
        studentId: userId,
        senderId: userId,
        senderName: nickname,
        messageContent: inputMessage,
        messageType: 'TALK',
        timestamp: new Date().toISOString(),
      };
      try {
        // WebSocket으로 메시지 전송
        stompClient.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify(newMessage),
        });

        setInputMessage(''); // 입력란 초기화
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
    // 퇴장 메시지 발송
    stompClient.publish({
      destination: '/pub/chat/exit',
      body: JSON.stringify({
        roomId: roomId,
        userId:userId,
        messageType: 'LEAVE'
      }),
    });
    // 탈퇴 로직
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