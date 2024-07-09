import * as React from 'react';
import { useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const oneToOneChats = [
    { id: '1', name: '수정이', time: '10:30 AM', message: 'hi~' },
    { id: '2', name: '수룡이', time: '11:15 AM', message: 'hello' },
];

const groupChats = [
    { id: '1', name: '영어', time: '09:00 AM', message: 'ABC' },
    { id: '2', name: '중국어', time: '10:45 AM', message: 'Ni hao!' },
];

export const ChatListScreen = () => {
    const [selectedChatType, setSelectedChatType] = useState('oneToOne');
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <TouchableOpacity 
        onPress={() => {
            if (selectedChatType === 'oneToOne') {
                navigation.navigate('OneChat', { chatId: item.id, chatName: item.name });
            } else {
                navigation.navigate('GroupChat', { chatId: item.id, chatName: item.name });
            }
        }}
            style={{ 
                padding: 10, 
                flexDirection: 'row', 
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#ccc'
            }}>
            <Image 
                source={require('../assets/circle_logo.png')} 
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} 
            />
            <View style={{ flex: 1 }}>
                <Text>{item.name}</Text>
                <Text>{item.message}</Text>
            </View>
            <Text style={{ color: '#888' }}>{item.time}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Image 
                source={require('../assets/Logo_ver2.png')} 
                style={{ width: 100, height: 100, marginTop: 20, resizeMode: 'contain' }} 
            />
            <View style={{ flexDirection: 'row', marginVertical: 20, width: '100%' }}>
                <TouchableOpacity 
                    onPress={() => setSelectedChatType('oneToOne')}
                    style={{ 
                        flex: 1, 
                        marginRight: 1, 
                        padding: 10, 
                        backgroundColor: selectedChatType === 'oneToOne' ? '#7F9AF5' : '#fff',
                        alignItems: 'center',
                        borderTopLeftRadius: 15, 
                        borderTopRightRadius: selectedChatType === 'oneToOne' ? 0 : 15, 
                    }}
                >
                    <Text>1:1 채팅</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setSelectedChatType('group')}
                    style={{ 
                        flex: 1, 
                        marginLeft: 1, 
                        padding: 10, 
                        backgroundColor: selectedChatType === 'group' ? '#7F9AF5' : '#fff',
                        alignItems: 'center',
                        borderTopRightRadius: 15, /* 위쪽 오른쪽 모서리 둥글게 */
                        borderTopLeftRadius: selectedChatType === 'group' ? 0 : 15, /* 선택되지 않은 경우 왼쪽 모서리 둥글게 */
                    }}
                >
                    <Text>그룹 채팅</Text>
                </TouchableOpacity>
            </View>
            <FlatList 
                data={selectedChatType === 'oneToOne' ? oneToOneChats : groupChats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={{ width: '100%' }}
            />
            <TouchableOpacity
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: '#A8A8A8',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ color: '#fff' }}>새 채팅 매칭하기</Text>
            </TouchableOpacity>
        </View>
    );
}
