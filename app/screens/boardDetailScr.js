import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DoneButton from '../components/DoneButton';
import { alertButtonStyle, horizontalLineStyle } from '../assets/styles/globalStyles';
import AlertModal from '../components/AlertModal';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BoardMatchingScreen } from './boardMatchingScr';
import { BoardEditScreen } from './boardEditScr';
import { API } from '../../config';
import { Splash } from './loadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const DayBox = ({ Day }) => {
    return (
        <View
            style={{
                borderColor: '#5678F0',
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5
            }}>
            <Text
                style={{
                    fontFamily: 'Pretendard-Bold',
                    fontSize: 13,
                    color: '#5678F0',
                }}>{Day}</Text>
        </View>
    )
}

const BoardDetail = ({ parentNav, item, route, navigation }) => {
    const [splash, setSplash] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isAuthor, setIsAuthor] = useState(true);
    const { postId, chatRoomId } = item;
    const [postData, setPostData] = useState({});
    const [recruitNum, setRecruitNum] = useState(0);
    const [attendNum, setAttendNum] = useState(0);
    const [weeklyInfos, setWeeklyInfos] = useState([]);
    const isFocused = useIsFocused();

    const fetchPost = async () => {
        try {
            const response = await fetch(`${API.POST}/MyPost/${postId}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            const data = await response.json();
            setPostData(data);
            setRecruitNum(data.chatRoomId.peopleNum);
            setWeeklyInfos(data.weeklyInfos);

            const chatRoomResponse = await fetch(`${API.CHAT}/room/${chatRoomId.roomId}/member`);
            if (!chatRoomResponse.ok) {
                throw new Error(`Network response was not ok: ${chatRoomResponse.status}`);
            }
            const chatData = await chatRoomResponse.json();
            setAttendNum(chatData.length);

            const userToken = await AsyncStorage.getItem('userToken'); // 로그인한 유저의 토큰 가져오기
            const userResponse = await fetch(`${API.USER}/mypage`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`, // Bearer 토큰을 포함시킴
                    'Content-Type': 'application/json',
                },
            });
            const userData = await userResponse.json();
            setIsAuthor(userData.usersDTO.userId == data.userId.userId);

        } catch (error) {
            console.error('Error fetching board detail :', error);
        }
        setSplash(false);
    };

    const deleteApi = async () => {
        try {
            const response = await fetch(
                `${API.POST}/writedDelete/${postId}`, { method: 'DELETE', }
            );

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

        } catch (error) {
            console.error('Error delete post :', error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchPost();
        }, 1000);
    }, [isFocused]);

    useEffect(() => {
        setSplash(true);
        fetchPost();
    }, []);

    const deletePost = ({ parentNav }) => {
        deleteApi();
        setModalVisible(false);
        parentNav.goBack();
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', paddingBottom: 25, paddingTop: 70 }}>
            <View style={{ marginHorizontal: 25 }}>
                <Text style={{ marginTop: 5, ...boardDetailStyle.LanguageText }}>{postData.language}</Text>
                <Text style={{ marginTop: 5, ...boardDetailStyle.TitleText }}>{postData.postTitle}</Text>
                <Text style={{ marginTop: 3, ...boardDetailStyle.InfoText }}>모집인원 {recruitNum}명 | 주 {postData.dayOfWeek}회 | {postData.faceToFace == "대면" ? "대면" : "비대면"}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: 15, marginRight: 10 }}>요일</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {weeklyInfos.map((data, index) => {
                            return (
                                <DayBox key={index} Day={data.week} />
                            )
                        })}
                    </View>
                </View>
            </View>
            <View style={{ ...horizontalLineStyle, marginVertical: 20 }} />
            <Text style={{ flex: 1, marginHorizontal: 25, ...boardDetailStyle.ContentText }}>{postData.postContent}</Text>
            <View style={{ marginTop: 20, ...horizontalLineStyle }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{
                    color: '#5678F0',
                    fontSize: 13,
                    paddingBottom: 15
                }}>현재 참여 인원: {attendNum}/{recruitNum}</Text>
            </View>
            {
                (attendNum == recruitNum) ?
                    <DoneButton text='채팅 입장하기' disablePress={true} />
                    : <DoneButton text='채팅 입장하기' onPress={
                        () => {
                            navigation.navigate('Match', parentNav, route);
                        }} />
            }
            {
                (isAuthor) ?
                    <View style={{ position: 'absolute', top: 45, right: 0, flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Edit', { item: postData })}
                            style={{ paddingHorizontal: 7 }}>
                            <Feather name="edit-3" size={24} color="#787878" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={{ marginRight: 15, paddingHorizontal: 7 }}>
                            <Feather name="trash-2" size={22} color="#787878" />
                        </TouchableOpacity>
                    </View>
                    : null
            }
            <AlertModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title='게시글 삭제'
                message={'정말 게시글을 삭제하시겠습니까?'}
                alertButtons={[
                    {
                        text: '취소',
                        style: alertButtonStyle.default,
                        onPress: () => { setModalVisible(false) }
                    },
                    {
                        text: '삭제',
                        style: alertButtonStyle.destructive,
                        onPress: () => { deletePost({ parentNav }) }
                    }
                ]}
            />
            <TouchableOpacity
                onPress={() => parentNav.pop()}
                style={{ position: 'absolute', top: 40, left: 15 }}>
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            {splash && <Splash /> }
        </View>
    )
}

export const BoardDetailScreen = ({ route, navigation }) => {
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

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName='Detail'>
                <Stack.Screen
                    name='Detail'
                    options={{ headerShown: false }}
                >{(props) => <BoardDetail parentNav={navigation} item={route.params} {...props} />}</Stack.Screen>
                <Stack.Screen
                    name='Edit'
                >{(props) => <BoardEditScreen item={route.params} {...props} />}</Stack.Screen>
                <Stack.Screen
                    name='Match'
                >{(props) => <BoardMatchingScreen item={route.params} parentNav={navigation} {...props} />}</Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const boardDetailStyle = StyleSheet.create({
    LanguageText: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 20,
        color: '#5678F0'
    },
    TitleText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 20
    },
    ContentText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 15
    },
    InfoText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 13,
        color: '#AAAAAA',
    }
});