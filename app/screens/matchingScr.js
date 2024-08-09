import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View } from 'react-native';
import InfoTableBox from '../components/InfoTableBox';
import DoneButton from '../components/DoneButton';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Image } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AlertModal from '../components/AlertModal';
import { alertButtonStyle, miniLanguageBox } from '../assets/styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../config'


const MatchingWaitScreen = ({ parentNav, navigation }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [failedMatch, setfailedMatch] = useState(false);
    const timeRef = useRef(null);

    const [myInfo, setMyInfo] = useState({
        nationality: '',
        learningLanguages: [],
    });

    useEffect(() => {
        const loadMyInfo = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken'); // 로그인한 유저의 토큰 가져오기
                const response = await fetch(`${API.USER}/mypage`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`, // Bearer 토큰을 포함시킴
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setMyInfo(prevMyInfo => ({
                    ...prevMyInfo,
                    nationality: data.usersDTO.nationality || prevMyInfo.nationality,
                    learningLanguages: data.desiredLangDTO.map(lang => lang.lang) || prevMyInfo.learningLanguages
                }));
            } catch (error) {
                console.error('Failed to load myInfo:', error);
            }
        }
        loadMyInfo();
    }, []);

    const editMyInfo = () => {
        console.log('edit my info');
    }

    const startMatching = async () => {
        setfailedMatch(false);
        setModalVisible(true);

        try {
            const userToken = await AsyncStorage.getItem('userToken'); // 로그인한 유저의 토큰 가져오기
            const response = await fetch(`${API.MATCH}/enqueue`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`, // Bearer 토큰을 포함시킴
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);

            if (response.status === 204) { // 매칭 실패 응답 처리
                failedMatching();
            } else if (!response.ok) {
                throw new Error('매칭 요청 실패');
            } else {
                const result = await response.json();
                if (!result || !result.roomId) {
                    failedMatching(); // 매칭 실패 처리
                } else {
                    MatchingCompleteScreen(); // 매칭 성공 처리
                }
            }

        } catch (error) {
            console.error('매칭 중 오류 발생:', error);
            failedMatching(); // 실패했을 때 매칭 실패 처리
        }

    }

    const stopMatching = async () => {
        clearTimeout(timeRef.current); // 타임아웃 클리어
        setModalVisible(false); // 모달 숨기기
        try {
            const userToken = await AsyncStorage.getItem('userToken'); // 로그인한 유저의 토큰 가져오기
            const response = await fetch(`${API.MATCH}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`, // Bearer 토큰을 포함시킴
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log('매칭이 취소되었습니다.'); // 매칭 취소 성공 메시지
            } else {
                console.error('매칭 취소 실패:', response.statusText); // 실패 메시지
            }
        } catch (error) {
            console.error('매칭 취소 중 오류 발생:', error); // 오류 메시지
        }
    };
    

    const failedMatching = () => {
        clearTimeout(timeRef.current);
        setfailedMatch(true);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#EBEDF6' }}>
            <View style={{ flex: 1, marginTop: '20%', justifyContent: 'center' }}>
                <Image style={{ alignSelf: 'center' }} source={require('../assets/images/matching_logo.png')} />
                <Text style={{ marginTop: 15, fontSize: 18, fontFamily: 'Pretendard-Regular', textAlign: 'center' }}>
                    {'회원님의 정보에 맞추어\n딱 알맞는 채팅 상대를 매칭할게요!'}
                </Text>
                <InfoTableBox
                    style={{ marginTop: 50 }}
                    title='내 정보'
                    tableInfos={[
                        {
                            title: '국적',
                            info: `${myInfo.nationality}`
                        },
                        {
                            title: '희망 학습 언어',
                            info: () => (
                                <View style={{ flexDirection: 'row' }}>
                                    {myInfo.learningLanguages.map((language, index) => (
                                        <View key={index} style={miniLanguageBox.box}>
                                            <Text style={miniLanguageBox.text}>{language}</Text>
                                        </View>
                                    ))}
                                </View>
                            ),
                            titleStyle: { fontSize: 11 }
                        }
                    ]}
                    showAdditionalButton={true}
                    buttonText='변경하기'
                    buttonOnPress={() => parentNav.navigate('MyPage')}
                />
            </View>
            <View style={{ marginTop: 20, marginBottom: '20%' }}>
                <DoneButton
                    text='매칭'
                    onPress={() => startMatching()}
                />
            </View>
            <AlertModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                showCloseButton={false}
                title={(failedMatch) ? '매칭 실패' : '채팅 상대 매칭'}
                message={(failedMatch) ? '매칭에 실패했습니다.' : '매칭 중...'}
                alertButtons={(failedMatch) ? [{
                    text: '확인',
                    style: alertButtonStyle.default,
                    onPress: () => { setModalVisible(false); }
                }] : [{
                    text: '취소',
                    style: alertButtonStyle.destructive,
                    onPress: () => { setModalVisible(false); stopMatching(); }
                }]}
                onRequestClose={() => { (failedMatch) ? setModalVisible(false) : stopMatching(); }}
            />
        </View>
    )
}

const MatchingCompleteScreen = () => {

    const enterChatRoom = () => {
        console.log('enter chat room');
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#EBEDF6' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 38, fontFamily: 'Pretendard-Bold', color: '#5678F0', textAlign: 'center' }}> Connected! </Text>
                <Image style={{ marginTop: 35, alignSelf: 'center' }} source={require('../assets/images/circle_logo_image.png')} />
                <InfoTableBox
                    style={{ marginTop: 50 }}
                    title='상대방 정보'
                    tableInfos={[
                        {
                            title: '국적',
                            info: '미국'
                        },
                        {
                            title: '희망 학습 언어',
                            info: () => (
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={miniLanguageBox.box}>
                                        <Text style={miniLanguageBox.text}>한국어</Text>
                                    </View>
                                </View>
                            ),
                            titleStyle: { fontSize: 11 }
                        }
                    ]}
                />
            </View>
            <View style={{ marginTop: 20, marginBottom: '20%' }}>
                <DoneButton
                    text='채팅 입장하기'
                    onPress={() => enterChatRoom()}
                />
            </View>
        </View>
    )
}

export const MatchingScreen = ({ navigation }) => {

    const [loaded, error] = useFonts({
        'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
        'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf')
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const Stack = createStackNavigator();

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName='Wait'>
                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name='Wait'>
                    {(props) => <MatchingWaitScreen parentNav={navigation} {...props} />}
                </Stack.Screen>
                <Stack.Screen
                    options={{
                        headerTitle: '',
                        headerStyle: { backgroundColor: '#EBEDF6' },
                        headerBackImage: () => (
                            <View style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 7 }}>
                                <Ionicons name="chevron-back" size={24} color="black" />
                            </View>
                        ),
                        headerShadowVisible: false
                    }}
                    name='Done' component={MatchingCompleteScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}