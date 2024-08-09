import { useFonts } from 'expo-font';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { infoBoxStyles } from '../assets/styles/globalStyles';
import DoneButton from '../components/DoneButton';
import InfoTableBox from '../components/InfoTableBox';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../../config';
import { Splash, SplashIcon } from './loadingScreen';

export const BoardMatchingScreen = ({ item, parentNav, navigation }) => {
    const [splash, setSplash] = React.useState(null);
    const roomId = item.chatRoomId.roomId;
    const roomName = item.chatRoomId.roomName;
    const recruit = item.chatRoomId.peopleNum;
    const language = item.language;
    const [attendNum, setAttendNum] = React.useState(0);

    const [loaded, error] = useFonts({
        'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
        'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf')
    });

    const getChatInfo = async () => {
        setSplash(true);
        try {
            const response = await fetch(
                `${API.CHAT}/room/${roomId}/member`
            );

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const data = await response.json();
            setAttendNum(data.length);

        } catch (error) {
            console.error('Error fetching board matching :', error);
        }
        setSplash(false);
    }

    const enterGroupRoom = () => {
        console.log('enter group chat room');
        parentNav.navigate('GroupChat', item);
    }

    useEffect(() => {
        getChatInfo();
    }, []);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }
    useEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerStyle: { backgroundColor: '#EBEDF6' },
            headerBackImage: () => (
                <View style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 7 }}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </View>
            ),
        });
    }, [navigation]);
    return (
        <View style={{ flex: 1, backgroundColor: '#EBEDF6' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ alignSelf: 'center', ...style.TitleText }}> {'Campus\nConnect!'} </Text>
                <Image style={{ marginTop: 20, alignSelf: 'center' }} source={require('../assets/images/circle_logo_image.png')} />
                <InfoTableBox
                    style={{ marginTop: 50 }}
                    title='스터디 정보'
                    tableInfos={[
                        {
                            title: '방제목',
                            info: roomName
                        },
                        {
                            title: '인원',
                            info: `${attendNum}/${recruit}`
                        },
                        {
                            title: '스터디 언어',
                            titleStyle: { fontSize: 11 },
                            info: language
                        }
                    ]}
                />
            </View>
            <View style={{ marginTop: 20, marginBottom: '20%' }}>
                <DoneButton
                    text='채팅 시작하기'
                    onPress={() => {
                        enterGroupRoom();
                    }}
                />
            </View>
            {splash && <Splash />}
        </View>
    )
}

const style = StyleSheet.create({
    TableContainer: {
        marginHorizontal: 20,
        marginVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#5678F0'
    },
    TableTitleContainer: {
        backgroundColor: '#F2F2F7',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 3,
        paddingRight: 10,
        paddingVertical: 10
    },
    TableContentContainer: {
        backgroundColor: '#ffffff',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 7,
        paddingLeft: 15,
        paddingVertical: 10
    },
    TableTitleText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 14
    },
    TableContentText: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 13
    },
    TitleText: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 36,
        color: '#5678F0'
    }
});