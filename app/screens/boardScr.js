import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Platform, ScrollView } from 'react-native';
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { BoardDetailScreen } from './boardDetailScr';
import { TextInput } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { BoardWriteScreen } from './boardWriteScr';
import SingleSelectButton from '../components/SingleSelectButton';
import { Feather } from '@expo/vector-icons';
import { BoardMatchingScreen } from './boardMatchingScr';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const BoarderTab = ({ navigation, tag }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#EBEDF6' }}>
            <FlatList
                data={[
                    { id: '0001', title: '완전 기초부터 공부하실 분 구합니다!', content: '주 2회 영어 회화 스터디', language: '영어', recruit: '4', frequency: '2', way: 'nftf', days: ['토', '일'] },
                    { id: '0002', title: '한국 문화 교류', content: '주 1회 한국 문화 체험', language: '한국어', recruit: '5', frequency: '1', way: 'ftf', days: ['월'] },
                ]}
                renderItem={({ item }) => {
                    return (
                        <View style={boardStyle.BoardContanier} >
                            <TouchableOpacity
                                style={{ paddingHorizontal: 20, paddingVertical: 15 }}
                                onPress={() => navigation.navigate('Detail', item)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={boardStyle.TagText}>{item.language}</Text>
                                </View>
                                <Text style={boardStyle.TitleText}>{item.title}</Text>
                                <Text style={boardStyle.InfoText}>모집인원 {item.recruit}명 | 주 {item.frequency}회 | {item.way == 'ftf' ? '대면' : '비대면'}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                }
            />
        </View>
    )
}

const BoardList = ({ navigation }) => {
    const [language, setLanguage] = React.useState({ data: '전체', index: 0 });

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '스터디 모집 게시판',
            headerTitleStyle: {
                fontFamily: 'Pretendard-Bold',
                fontSize: 18,
                marginLeft: 10
            },
            headerShadowVisible: false,
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}
                        onPress={() => navigation.navigate('Search')}>
                        <FontAwesome name="search" size={18} color="#000000" style={{ marginRight: 5 }} />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <SingleSelectButton
                        count={7}
                        textArray={['전체', '영어', '한국어', '중국어', '일본어', '스페인어', '불어']}
                        initialSelect={0}
                        getSelected={setLanguage}
                        selectedButtonColor="#000000"
                        selectedTextColor="#ffffff"
                        containerStyle={{ flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#EBEDF6' }}
                        buttonStyle={{ width: 66, height: 37, ...boardStyle.SelectButton }}
                        textStyle={boardStyle.SelectText}
                    />
                </ScrollView>
            </View>
            <BoarderTab navigation={navigation} tag={language} />
            <TouchableOpacity style={boardStyle.WriteButton}
                onPress={() => navigation.navigate('Write')}>
                <Octicons name="pencil" size={35} color="#5678F0" />
            </TouchableOpacity>
        </View>
    )
}

const BoardSearchPage = ({ navigation }) => {
    const Searching = () => {
        console.log('searching')
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#EBEDF6' }}>
            <FlatList
                style={{ paddingTop: 10 }}
                data={[

                ]}
                renderItem={({ item }) => {
                    return (
                        <View style={boardStyle.BoardContanier} >
                            <TouchableOpacity
                                style={{ paddingHorizontal: 20, paddingVertical: 15 }}
                                onPress={() => navigation.navigate('Detail', item)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={boardStyle.TagText}>{item.language}</Text>
                                </View>
                                <Text style={boardStyle.TitleText}>{item.title}</Text>
                                <Text style={boardStyle.InfoText}>모집인원 {item.recruit}명 | 주 {item.frequency}회 | {item.way == 'ftf' ? '대면' : '비대면'}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                }
            />
        </View>
    )
}

export const BoardScreen = ({ navigation }) => {
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
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen
                    name="Main"
                >{(props) => <BoardList {...props} />}</Stack.Screen>
                <Stack.Screen
                    options={{
                        headerTitle: '',
                        headerBackImage: () => (
                            <Ionicons name="chevron-back" size={24} color="black" />
                        ),
                        headerRight: () => (
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ paddingHorizontal: 7 }}>
                                    <Feather name="edit-3" size={24} color="#787878" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginRight: 15, paddingHorizontal: 7 }}>
                                    <Feather name="trash-2" size={22} color="#787878" />
                                </TouchableOpacity>
                            </View>

                        ),
                        headerShadowVisible: false
                    }}
                    name="Detail"
                >{(props) => <BoardDetailScreen {...props} />}</Stack.Screen>
                <Stack.Screen
                    options={{
                        headerTitle: '',
                        headerBackImage: () => (
                            <AntDesign name="close" size={24} color="#CACACA" />
                        )
                    }}
                    name='Write'
                >{(props) => <BoardWriteScreen {...props} />}</Stack.Screen>
                <Stack.Screen
                    options={{
                        headerTitle: () => (
                            <View style={{ flex: 1, width: 300, marginVertical: 10 }}>
                                <TextInput
                                    placeholder='검색어를 입력하세요.'
                                    style={boardStyle.SearchInputContainer}
                                />
                            </View>
                        ),
                        headerTitleStyle: { display: 'none' },
                        headerRight: () => (
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}
                                    onPress={() => console.log('Searching')}>
                                    <FontAwesome name="search" size={18} color="#000000" style={{ marginRight: 5 }} />
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    name='Search'
                >{(props) => <BoardSearchPage {...props} />}</Stack.Screen>
                <Stack.Screen
                    options={{
                        headerTitle: '',
                        headerStyle: { backgroundColor: '#EBEDF6' },
                        headerBackImage: () => (
                            <View style={{backgroundColor:'#ffffff', borderRadius: 12, padding: 7}}>
                                <Ionicons name="chevron-back" size={24} color="black" />
                            </View>
                        ),
                    }}
                    name='Match'
                >{(props) => <BoardMatchingScreen {...props} />}</Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const boardStyle = StyleSheet.create({
    BoardContanier: {
        fontFamily: 'Pretendard-Regular',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 5,
    },
    TagText: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 13,
        color: '#5678F0',
    },
    TitleText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 13,
        marginTop: 5
    },
    InfoText: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 9,
        color: '#AAAAAA',
        marginTop: 5
    },
    SerchingBox: {
        backgroundColor: '#EBEDF6',
        width: 180,
        height: 40,
        padding: 10,
        borderRadius: 10
    },
    WriteButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginRight: 20,
        marginBottom: 20,
        borderColor: '#5678F0',
        borderWidth: 3,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    SelectButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginLeft: 5,
        marginRight: 5,
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
    },
    SearchInputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 7,
        marginRight: 10,
        paddingHorizontal: 10
    }
});