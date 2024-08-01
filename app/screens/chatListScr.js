import * as React from 'react';
import { useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
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
            style={styles.chatItem}>
            <Image 
                source={require('../assets/circle_logo.png')} 
                style={styles.chatItemImage} 
            />
            <View style={{ flex: 1 }}>
                <Text>{item.name}</Text>
                <Text>{item.message}</Text>
            </View>
            <Text style={{ color: '#888' }}>{item.time}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/Logo_ver2.png')} 
                style={styles.logo} 
            />
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    onPress={() => setSelectedChatType('oneToOne')}
                    style={[
                        styles.tabButton, 
                        { 
                            backgroundColor: selectedChatType === 'oneToOne' ? '#7F9AF5' : '#fff',
                            borderTopLeftRadius: 15, 
                            borderTopRightRadius: 0,
                        }
                    ]}
                >
                    <Text style={{ color: selectedChatType === 'oneToOne' ? '#fff' : '#000' }}>1:1 채팅</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setSelectedChatType('group')}
                    style={[
                        styles.tabButton, 
                        { 
                            backgroundColor: selectedChatType === 'group' ? '#7F9AF5' : '#fff',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 15, 
                        }
                    ]}
                >
                    <Text style={{ color: selectedChatType === 'group' ? '#fff' : '#000' }}>그룹 채팅</Text>
                </TouchableOpacity>
            </View>
            <FlatList 
                data={selectedChatType === 'oneToOne' ? oneToOneChats : groupChats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={{ width: '100%' }}
                ListFooterComponent={
                    <TouchableOpacity
                        style={styles.newChatButton}
                    >
                        <ImageBackground
                            source={require('../assets/Logo_ver3.png')}
                            style={styles.newChatButtonBackground}
                            imageStyle={styles.newChatButtonImage}
                            resizeMode="contain"
                        >
                            <View style={styles.newChatButtonContent}>
                                <Text style={styles.newChatButtonText}>새 채팅 매칭하기</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#EBEDF6',
    },
    logo: {
        width: 100,
        height: 100,
        marginTop: 20,
        resizeMode: 'contain',
    },
    tabContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        width: '100%',
    },
    tabButton: {
        flex: 1,
        marginHorizontal: 1,
        padding: 10,
        alignItems: 'center',
        borderTopLeftRadius: 15, 
        borderTopRightRadius: 15, 
    },
    chatItem: { 
        padding: 10, 
        flexDirection: 'row', 
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    chatItemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    newChatButton: {
        width: '100%',
        height: 100, 
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#A9A9A9', 
        borderWidth: 1,
        marginTop: 10, 
    },
    newChatButtonBackground: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EBEBEB', 
    },
    newChatButtonImage: {
        opacity: 0.3, 
    },
    newChatButtonContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    newChatButtonText: {
        color: '#000', 
        fontSize: 18,
        fontWeight: 'bold',
    },
});
