import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Platform, Alert, BackHandler } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import SingleSelectButton from '../components/SingleSelectButton';
import MultiSelectButton from '../components/MultiSelectButton';
import { Entypo, AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { alertButtonStyle, horizontalLineStyle, selectButtonStyle, toastConfig } from '../assets/styles/globalStyles';
import DoneButton from '../components/DoneButton';
import AlertModal from '../components/AlertModal';
import { API } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const removeSpace = text => (text.replace(/\s/g, ''))

export const BoardWriteScreen = ({ navigation }) => {
    const [faceToFace, setFaceToFace] = useState(null);
    const [selectedDays, setSelectedDays] = useState(null);
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState(null);
    const [items, setItems] = useState([
        { label: '한국어', value: '한국어' },
        { label: '영어', value: '영어' },
        { label: '중국어', value: '중국어' },
        { label: '일본어', value: '일본어' },
        { label: '스페인어', value: '스페인어' },
        { label: '불어', value: '불어' },
    ]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [chatname, setChatname] = useState('');
    const [recruit, setRecruit] = useState();

    const [modalVisible, setModalVisible] = useState(false);

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
    useEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerLeft: () => (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <AntDesign name="close" size={24} color="#CACACA" />
                </TouchableOpacity>
            )
        });
    }, [navigation]);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            setModalVisible(true);
            return true;
        });

    }, []);

    const checkDays = () => {
        let dayArray = ['월', '화', '수', '목', '금', '토', '일'];
        let weeklyInfos = [];
        for (let i = 0; i < dayArray.length; i++) {
            if (selectedDays[i] == true) {
                weeklyInfos = [...weeklyInfos, { week: dayArray[i] }]
            }
        }
        return weeklyInfos;
    }

    const writePost = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        let count = selectedDays.filter(element => true == element).length;
        let roomType = 1;
        let weeklyInfos = checkDays();
        try {
            const response = await fetch(`${API.POST}/writePost`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dayOfWeek: count,
                    faceToFace: faceToFace.data,
                    language: language,
                    postContent: content,
                    postTitle: title,
                    peopleNum: Number(recruit),
                    chatRoomName: chatname,
                    roomType: roomType,
                    weeklyInfos: weeklyInfos
                }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

        } catch (error) {
            console.error('Error editng post :', error);
        }
    };


    const CreateStudy = () => {
        if (language == null) {
            Toast.show({
                type: 'default',
                text1: '언어를 선택해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (removeSpace(chatname) == '') {
            Toast.show({
                type: 'default',
                text1: '채팅방명을 입력해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (removeSpace(recruit.toString()) == '') {
            Toast.show({
                type: 'default',
                text1: '최대 정원을 입력해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (isNaN(recruit) || recruit.toString().includes('.')) {
            Toast.show({
                type: 'default',
                text1: '최대 정원은 정수만 입력 가능합니다.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (Number(recruit) < 2 || Number(recruit) > 10) {
            Toast.show({
                type: 'default',
                text1: '최대 정원은 2~10인입니다.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (removeSpace(title) == '') {
            Toast.show({
                type: 'default',
                text1: '게시글 제목을 입력해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (removeSpace(content) == '') {
            Toast.show({
                type: 'default',
                text1: '스터디 내용을 입력해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (selectedDays == null || selectedDays.includes(true) == false) {
            Toast.show({
                type: 'default',
                text1: '요일을 선택해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else if (faceToFace == null) {
            Toast.show({
                type: 'default',
                text1: '스터디 방식을 선택해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else {
            writePost();
            navigation.pop();
        }
    }

    return (
        <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
            <View style={{ marginHorizontal: 15 }}>
                <DropDownPicker
                    open={open}
                    value={language}
                    items={items}
                    setOpen={setOpen}
                    setValue={setLanguage}
                    setItems={setItems}
                    placeholder={'언어 선택'}
                    textStyle={{ fontFamily: 'Pretendard-Bold', fontSize: 17, color: '#5678F0' }}
                    containerStyle={{ width: 130 }}
                    style={{ borderWidth: 0 }}
                    dropDownContainerStyle={{ borderWidth: 0 }}
                    showArrowIcon={true}
                    showTickIcon={false}
                    ArrowDownIconComponent={() => <Entypo name="chevron-small-down" size={24} color="#5678F0" />}
                    ArrowUpIconComponent={() => <Entypo name="chevron-small-up" size={24} color="#5678F0" />}
                />
            </View>

            <View style={{ marginHorizontal: 25, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={style.GuideText}>채팅방명</Text>
                <TextInput
                    value={chatname}
                    onChangeText={(text) => { setChatname(text) }}
                    style={style.InfoText} placeholder='채팅방명을 입력해 주세요.' />
            </View>
            <View style={{ marginHorizontal: 25, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={style.GuideText}>최대정원</Text>
                <TextInput
                    value={recruit}
                    onChangeText={(number) => { setRecruit(number) }}
                    style={style.GuideTextstyle}
                    keyboardType='number-pad'
                    placeholder='채팅방 정원을 입력해 주세요. (2~10)' />
            </View>
            <GestureHandlerRootView>
                <ScrollView style={{ height: '60%' }}>
                    <TextInput
                        value={title}
                        onChangeText={(text) => { setTitle(text) }}
                        style={{ marginHorizontal: 25, marginTop: 18, ...style.TitleText }}
                        placeholder='게시글 제목을 입력해 주세요.' />
                    <View style={horizontalLineStyle} />
                    <View style={{ marginHorizontal: 25 }}>
                        <TextInput
                            value={content}
                            onChangeText={(text) => { setContent(text) }}
                            style={{ textAlignVertical: 'top', minHeight: 300, ...style.ContentText }}
                            multiline={true}
                            placeholder='스터디 내용을 입력해 주세요.' />
                    </View>
                    <View style={{ marginHorizontal: 25 }}>
                        <Text style={{ ...style.InfoText }}>요일 선택</Text>
                        <MultiSelectButton
                            count={7}
                            textArray={['월', '화', '수', '목', '금', '토', '일']}
                            getSelected={setSelectedDays}
                            selectedButtonColor="#000000"
                            selectedTextColor="#ffffff"
                            containerStyle={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}
                            buttonStyle={{ width: 37, height: 37, marginLeft: 5, ...selectButtonStyle.container }}
                            textStyle={selectButtonStyle.text}
                        />
                        <Text style={{ marginTop: 15, ...style.InfoText }}>방식</Text>
                        <SingleSelectButton
                            count={2}
                            textArray={['대면', '비대면']}
                            getSelected={setFaceToFace}
                            selectedButtonColor="#000000"
                            selectedTextColor="#ffffff"
                            containerStyle={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}
                            buttonStyle={{ width: 66, height: 37, marginLeft: 5, ...selectButtonStyle.container }}
                            textStyle={selectButtonStyle.text}
                        />
                    </View>
                    <DoneButton containerStyle={{ marginTop: 10, marginBottom: 15 }} text='스터디 생성' onPress={() => CreateStudy()} />
                </ScrollView>
            </GestureHandlerRootView>

            <Toast config={toastConfig} />

            <AlertModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                showCloseButton={false}
                title={'경고'}
                message={'페이지를 벗어날 경우\n작성 중인 내용이 사라집니다.'}
                alertButtons={[{
                    text: '확인',
                    style: alertButtonStyle.default,
                    onPress: () => { setModalVisible(false); navigation.pop(); }
                }, {
                    text: '취소',
                    style: alertButtonStyle.destructive,
                    onPress: () => { setModalVisible(false); }
                }]}
                onRequestClose={() => { (failedMatch) ? setModalVisible(false) : stopMatching(); }}
            />
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
    SelectText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 14
    },
});