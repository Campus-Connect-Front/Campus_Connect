import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

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

    const { title, content, language, recruit, frequency, way, days } = route.params;
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 25, paddingBottom: 25, paddingTop: 5 }}>
            <Text style={boardDetailStyle.LanguageText}>{language}</Text>
            <Text style={{ marginTop: 5, ...boardDetailStyle.TitleText }}>{title}</Text>
            <Text style={{ marginTop: 3, ...boardDetailStyle.InfoText }}>모집인원 {recruit}명 | 주 {frequency}회 | {way == 'ftf' ? '대면' : '비대면'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: 15, marginRight: 10 }}>요일</Text>
                <View style={{ flexDirection: 'row' }}>
                    {days.map((data, index) => {
                        return (
                            <DayBox Day={data} />
                        )
                    })}
                </View>
            </View>
            <View style={boardDetailStyle.HorizontalLine} />
            <Text style={{ flex: 1, paddingHorizontal: 5, ...boardDetailStyle.ContentText }}>{content}</Text>
            <View style={boardDetailStyle.HorizontalLine} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{
                    color: '#5678F0',
                    fontSize: 13,
                    paddingBottom: 15
                }}>현재 참여 인원: 2/{recruit}</Text>
            </View>

            <View style={{ backgroundColor: '#5678F0', borderRadius: 16, }}>
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => navigation.navigate('Match')}
                >
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Pretendard-Bold',
                        color: '#ffffff',
                        paddingVertical: 15
                    }}>채팅 입장하기</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const boardDetailStyle = StyleSheet.create({
    HorizontalLine: {
        height: 0.7,
        backgroundColor: '#5678F0',
        marginVertical: 20
    },
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