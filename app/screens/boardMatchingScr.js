import { useFonts } from 'expo-font';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { infoBoxStyles } from '../assets/styles/globalStyles';
import DoneButton from '../components/DoneButton';
import InfoTableBox from '../components/InfoTableBox';

export const BoardMatchingScreen = () => {
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
        <View style={{ flex: 1, paddingHorizontal: 25, backgroundColor: '#EBEDF6' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={style.TitleText}>Campus</Text>
                <Text style={style.TitleText}>Connect!</Text>
                <Image style={{ marginTop: 20 }} source={require('../assets/images/circle_logo_image.png')} />
            </View>
            <View style={{ marginTop: 30 }}>
                <InfoTableBox 
                    title='스터디 정보'
                    tableInfos={[
                        {
                            title: '방제목',
                            info: '영어 AtoZ'
                        },
                        {
                            title: '인원',
                            info: '5/6'
                        },
                        {
                            title: '스터디 언어',
                            titleStyle: {fontSize: 11},
                            info: '영어'
                        }
                    ]}
                />
            </View>
            <DoneButton text='채팅 시작하기' containerStyle={{ marginTop: 30, marginBottom: 70 }} />
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