import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-elements';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import ParticipantModal from './ParticipantModal'; 

const initialMessages = [
  { id: '1', text: 'Hi!', sender: 'AAA', isMine: false, time: '오전 10:00' },
  { id: '2', text: 'Hello', isMine: true, time: '오전 10:01' },
  { id: '3', text: 'Good Morning', sender: 'BBB', isMine: false, time: '오전 10:02' },
  { id: '4', text: 'Nice to meet you', sender: 'CCC', isMine: false, time: '오전 10:03' },
];

const initialParticipants = [
  { id: 'AAA', name: 'User AAA', profileImage: require('../assets/circle_logo.png') },
  { id: 'BBB', name: 'User BBB', profileImage: require('../assets/circle_logo.png') },
  { id: 'CCC', name: 'User CCC', profileImage: require('../assets/circle_logo.png') },
];

export const GroupChatScreen = ({ route, navigation }) => {
  const { chatName } = route.params;
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [participants] = useState(initialParticipants);

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
    if (inputText.trim().length > 0) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: inputText,
        isMine: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isMine ? styles.myMessageContainer : styles.otherMessageContainer]}>
      {!item.isMine && <Image source={require('../assets/circle_logo.png')} style={styles.profileImage} />}
      <View>
        {!item.isMine && <Text style={styles.senderName}>{item.sender}</Text>}
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
      />
    </KeyboardAvoidingView>
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
});
