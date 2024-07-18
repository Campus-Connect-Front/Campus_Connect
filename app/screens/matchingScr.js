import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View } from 'react-native';
import InfoTableBox from '../components/InfoTableBox';
import DoneButton from '../components/DoneButton';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Image } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const MatchingWaitScreen = ({ navigation }) => {

    const editMyInfo = () => {
        console.log('edit my info');
    }

    const startMatching = () => {
        navigation.navigate('Done');
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
                            info: '한국'
                        },
                        {
                            title: '희망 학습 언어',
                            info: '컴포넌트 추가',
                            titleStyle: { fontSize: 11 }
                        }
                    ]}
                    showAdditionalButton={true}
                    buttonText='변경하기'
                    buttonOnPress={() => editMyInfo()}
                />
            </View>
            <View style={{ marginTop: 20, marginBottom: '20%' }}>
                <DoneButton
                    text='매칭'
                    onPress={() => startMatching()}
                />
            </View>
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
                            info: '한국'
                        },
                        {
                            title: '희망 학습 언어',
                            info: '컴포넌트 추가',
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

export const MatchingScreen = () => {

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
                    name='Wait' component={MatchingWaitScreen}
                />
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