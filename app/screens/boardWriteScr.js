import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import SingleSelectButton from '../components/SingleSelectButton';
import MultiSelectButton from '../components/MultiSelectButton';
import { Entypo } from '@expo/vector-icons';

export const BoardWriteScreen = () => {
    const [selectedWay, setSelectedWay] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
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
        <View style={{ backgroundColor: '#ffffff', flex: 1 }}>


            <ScrollView>
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
                    <TextInput style={style.InfoText} placeholder='채팅방명을 입력해 주세요.' />
                </View>
                <View style={{ marginHorizontal: 25, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={style.GuideText}>최대정원</Text>
                    <TextInput style={style.InfoText} keyboardType='number-pad' placeholder='채팅방 정원을 입력해 주세요.' />
                </View>
                <TextInput style={{ marginHorizontal: 25, marginTop: 18, ...style.TitleText }} placeholder='게시글 제목을 입력해 주세요.' />
                <View style={style.HorizontalLine} />
                <View style={{marginHorizontal: 25}}>
                    <TextInput style={{ textAlignVertical: 'top', minHeight: 300, ...style.ContentText }} multiline={true} placeholder='스터디 내용을 입력해 주세요.' />
                </View>
                <View style={{marginHorizontal: 25}}>
                    <Text style={{ ...style.InfoText }}>요일 선택</Text>
                    <MultiSelectButton
                        count={7}
                        textArray={['월', '화', '수', '목', '금', '토', '일']}
                        getSelected={setSelectedWay}
                        selectedButtonColor="#000000"
                        selectedTextColor="#ffffff"
                        containerStyle={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}
                        buttonStyle={{ width: 37, height: 37, ...style.SelectButton }}
                        textStyle={style.SelectText}
                    />
                    <Text style={{ marginTop: 15, ...style.InfoText }}>방식</Text>
                    <SingleSelectButton
                        count={2}
                        textArray={['대면', '비대면']}
                        getSelected={setSelectedDays}
                        selectedButtonColor="#000000"
                        selectedTextColor="#ffffff"
                        containerStyle={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}
                        buttonStyle={{ width: 66, height: 37, ...style.SelectButton }}
                        textStyle={style.SelectText}
                    />

                    <View style={{ backgroundColor: '#5678F0', borderRadius: 16, marginTop: 10 }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'Pretendard-Bold',
                                color: '#ffffff',
                                paddingVertical: 15
                            }}>스터디 생성</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    HorizontalLine: {
        height: 0.7,
        backgroundColor: '#5678F0',
        marginVertical: 10,
        marginHorizontal: 25
    },
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
    SelectButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginLeft: 5,
        ...Platform.select({
            ios: {
                shadowColor: "#000000",
                shadowOpacity: 0.45,
            },
            android: { elevation: 5 }
        })
    },
    SelectText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 14
    }
});