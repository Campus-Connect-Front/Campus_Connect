import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

const showDeleteAlert = ({navigation}) => {
    Alert.alert(
        '삭제',
        '정말 게시글을 삭제하시겠습니까?',
        [
            {
                text: '삭제',
                style: 'destructive',
                onPress: () => {
                    console.log('delete');
                    navigation.pop();
                }
            },
            {
                text: '취소',
                style: 'cancel',
            },
        ],
        {
            cancelable: true,
        },
    );
}

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
    const isAuthor = true;
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

    const { id, title, content, language, recruit, frequency, way, days } = route.params;
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
            {(recruit == 2) ?
                <View>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{
                            color: '#5678F0',
                            fontSize: 13,
                            paddingBottom: 15
                        }}>현재 참여 인원: 2/{recruit}</Text>
                    </View>

                    <View style={{ backgroundColor: '#dbdbdb', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'Pretendard-Bold',
                            color: '#848484',
                            paddingVertical: 15
                        }}>채팅 입장하기</Text>
                    </View>
                </View>
                : <View>
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
            }
            {
                (isAuthor) ?
                    <View style={{ position: 'absolute', top: 5, right: 0, flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Edit', route.params)}
                            style={{ paddingHorizontal: 7 }}>
                            <Feather name="edit-3" size={24} color="#787878" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => showDeleteAlert({navigation})}
                            style={{ marginRight: 15, paddingHorizontal: 7 }}>
                            <Feather name="trash-2" size={22} color="#787878" />
                        </TouchableOpacity>
                    </View>
                    : null
            }
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