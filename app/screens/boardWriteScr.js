import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import SingleSelectButton from '../components/SingleSelectButton';
import MultiSelectButton from '../components/MultiSelectButton';
import { Entypo } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { horizontalLineStyle, selectButtonStyle, toastConfig } from '../assets/styles/globalStyles';
import DoneButton from '../components/DoneButton';

const removeSpace = text => (text.replace(/\s/g, ''))

export const BoardWriteScreen = ({ navigation }) => {
    const [selectedWay, setSelectedWay] = useState(null);
    const [selectedDays, setSelectedDays] = useState(null);
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState(null);
    const [items, setItems] = useState([
        { label: '한국어', value: 'korean' },
        { label: '영어', value: 'english' },
        { label: '중국어', value: 'chinese' },
        { label: '일본어', value: 'japanese' },
        { label: '스페인어', value: 'spanish' },
        { label: '불어', value: 'french' },
    ]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [chatname, setChatname] = useState('');
    const [recruit, setRecruit] = useState('');

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
            headerBackImage: () => (
                <AntDesign name="close" size={24} color="#CACACA" />
            )
        });
    }, [navigation]);

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
        } else if (selectedWay == null) {
            Toast.show({
                type: 'default',
                text1: '스터디 방식을 선택해 주세요.',
                bottomOffset: 50,
                position: 'bottom'
            });
        } else {
            console.log('create study successful');
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
                            getSelected={setSelectedWay}
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