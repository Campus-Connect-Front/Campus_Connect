import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DoneButton from '../components/DoneButton';
import { alertButtonStyle, horizontalLineStyle } from '../assets/styles/globalStyles';
import AlertModal from '../components/AlertModal';

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
    const [modalVisible, setModalVisible] = useState(false);
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

    const deletePost = ({navigation}) => {
        console.log('delete');
        setModalVisible(false);
        navigation.pop();
    }

    const { id, title, content, language, recruit, frequency, way, days } = route.params;
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', paddingBottom: 25 }}>
            <View style={{ marginHorizontal: 25 }}>
                <Text style={{ marginTop: 5, ...boardDetailStyle.LanguageText }}>{language}</Text>
                <Text style={{ marginTop: 5, ...boardDetailStyle.TitleText }}>{title}</Text>
                <Text style={{ marginTop: 3, ...boardDetailStyle.InfoText }}>모집인원 {recruit}명 | 주 {frequency}회 | {way == 'ftf' ? '대면' : '비대면'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: 15, marginRight: 10 }}>요일</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {days.map((data, index) => {
                            return (
                                <DayBox key={index} Day={data} />
                            )
                        })}
                    </View>
                </View>
            </View>
            <View style={{ ...horizontalLineStyle, marginVertical: 20 }} />
            <Text style={{ flex: 1, marginHorizontal: 25, ...boardDetailStyle.ContentText }}>{content}</Text>
            <View style={{ marginTop: 20, ...horizontalLineStyle }} />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{
                    color: '#5678F0',
                    fontSize: 13,
                    paddingBottom: 15
                }}>현재 참여 인원: 2/{recruit}</Text>
            </View>
            {
                (recruit == 2) ?
                    <DoneButton text='채팅 입장하기' disablePress={true} />
                    : <DoneButton text='채팅 입장하기' onPress={() => navigation.navigate('Match')} />
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
                        onPress: () => { deletePost({navigation}) }
                    }
                ]}
            />
        </View>
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