import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';

const messages = [
  { id: '1', text: '안녕하세요!', sender: 'AAA', isMine: false, time: '오전 10:00' },
  { id: '2', text: '안녕하세요! 반갑습니다.', isMine: true, time: '오전 10:01' },
  { id: '3', text: '저도 반갑습니다.', sender: 'BBB', isMine: false, time: '오전 10:02' },
  { id: '4', text: '모두 안녕하세요!', sender: 'CCC', isMine: false, time: '오전 10:03' },
];

export const GroupChatScreen = ({ route }) => {
  const { chatName } = route.params;

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isMine ? styles.myMessageContainer : styles.otherMessageContainer]}>
      {!item.isMine && <Image source={require('../assets/circle_logo.png')} style={styles.profileImage} />}
      <View>
        {!item.isMine && <Text style={styles.senderName}>{item.sender}</Text>}
        {item.isMine && (
          <TouchableOpacity>
            <Text style={styles.spellCheckButton}>맞춤법 수정하기</Text>
          </TouchableOpacity>
        )}
        <View style={[styles.bubbleContainer, item.isMine ? styles.myBubbleContainer : styles.otherBubbleContainer]}>
          <View style={[styles.bubble, item.isMine ? styles.myBubble : styles.otherBubble]}>
            <Text style={item.isMine ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
          </View>
          <Text style={item.isMine ? styles.myMessageTime : styles.otherMessageTime}>{item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="메시지를 입력하세요." />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
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
  myBubbleContainer: {
    alignItems: 'flex-end',
  },
  otherBubbleContainer: {
    alignItems: 'flex-start',
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
  senderName: {
    color: '#9291A6',
    fontSize: 12,
    marginBottom: 2,
  },
  spellCheckButton: {
    color: '#9291A6',
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
    marginBottom: 5,
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
    backgroundColor: '#5678F0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
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
});

export default GroupChatScreen;
