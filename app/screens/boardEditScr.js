import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import SingleSelectButton from '../components/SingleSelectButton';
import MultiSelectButton from '../components/MultiSelectButton';
import Toast from 'react-native-toast-message';
import { horizontalLineStyle, selectButtonStyle, toastConfig } from '../assets/styles/globalStyles';
import DoneButton from '../components/DoneButton';

const removeSpace = text => (text.replace(/\s/g, ''))

export const BoardEditScreen = ({ route, navigation }) => {
    const { id, title, content, language, recruit, frequency, way, days } = route.params;

    const [editTitle, setEditTitle] = useState(route.params.title);
    const [editContent, setEditContent] = useState(route.params.content);
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

    const EditStudy = () => {
        if (removeSpace(editTitle) == '') {
            Toast.show({
                type: 'default',
                text1: '게시글 제목을 입력해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (removeSpace(editContent) == '') {
            Toast.show({
                type: 'default',
                text1: '스터디 내용을 입력해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else {
            console.log('edit study successful');
            navigation.pop();
        }
    }

    return (
        <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
            <ScrollView>
                <View style={{ marginHorizontal: 25, marginTop: 15, marginBottom: 10 }}>
                    <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: 17, color: '#5678F0' }}
                    >{language}</Text>
                </View>

                <View style={{ marginHorizontal: 25, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={style.GuideText}>채팅방명</Text>
                    <TextInput style={style.InfoText} editable={false} placeholder='영어 AtoZ' />
                </View>
                <View style={{ marginHorizontal: 25, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={style.GuideText}>최대정원</Text>
                    <TextInput style={style.InfoText} editable={false} keyboardType='number-pad' placeholder={recruit} />
                </View>
                <TextInput
                    value={editTitle}
                    onChangeText={(text) => { setEditTitle(text) }}
                    style={{ marginHorizontal: 25, marginTop: 18, ...style.TitleText }}
                    placeholder='게시글 제목을 입력해 주세요.'/>
                <View style={horizontalLineStyle} />
                <View style={{ marginHorizontal: 25 }}>
                    <TextInput
                        value={editContent}
                        onChangeText={(text) => { setEditContent(text) }}
                        style={{ textAlignVertical: 'top', minHeight: 300, ...style.ContentText }}
                        multiline={true}
                        placeholder='스터디 내용을 입력해 주세요.'/>
                </View>
                <View style={{ marginHorizontal: 25 }}>
                    <Text style={{ ...style.InfoText }}>요일 선택</Text>
                    <MultiSelectButton
                        fixedSelect={true}
                        initialSelect={[0, 1]}
                        count={7}
                        textArray={['월', '화', '수', '목', '금', '토', '일']}
                        selectedButtonColor="#666666"
                        selectedTextColor="#cecece"
                        containerStyle={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}
                        buttonStyle={{ width: 37, height: 37, marginLeft: 5, ...selectButtonStyle.container }}
                        textStyle={{ color: '#848484', ...selectButtonStyle.text }}
                    />
                    <Text style={{ marginTop: 15, ...style.InfoText }}>방식</Text>
                    <SingleSelectButton
                        fixedSelect={true}
                        initialSelect={(way == 'ftf' ? 0 : 1)}
                        count={2}
                        textArray={['대면', '비대면']}
                        selectedButtonColor="#666666"
                        selectedTextColor="#cecece"
                        containerStyle={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}
                        buttonStyle={{ width: 66, height: 37, marginLeft: 5, ...selectButtonStyle.container }}
                        textStyle={{ color: '#848484', ...selectButtonStyle.text}}
                    />
                </View>
                <DoneButton containerStyle={{ marginTop: 10 }} text='게시글 수정' onPress={() => EditStudy()} />
            </ScrollView>
            <Toast config={toastConfig}/>
        </View>
    )
}

const style = StyleSheet.create({
    LanguageText: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 15,
        color: '#5678F0',
    },
    GuideText: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 15,
        color: '#656565',
        marginRight: 15
    },
    TitleText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 15
    },
    ContentText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 14
    },
    InfoText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 15,
    },
});