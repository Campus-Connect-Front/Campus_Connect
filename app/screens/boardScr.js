import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Platform, ScrollView, TextInput } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { BoardDetailScreen } from './boardDetailScr';
import { FontAwesome } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { BoardWriteScreen } from './boardWriteScr';
import SingleSelectButton from '../components/SingleSelectButton';
import { Feather } from '@expo/vector-icons';
import { BoardMatchingScreen } from './boardMatchingScr';
import { BoardEditScreen } from './boardEditScr';
import { selectButtonStyle } from '../assets/styles/globalStyles';
import { API } from '../../config';
import { Splash, SplashIcon } from './loadingScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();


const BoardList = React.forwardRef((props, ref) => {
    const { parentNav, navigation } = props;
    const [language, setLanguage] = React.useState({ data: '전체', index: 0 });
    const [splash, setSplash] = React.useState(null);
    const [postList, setPostList] = React.useState({});

    const fetchBoard = async () => {
        setSplash(true);
        try {
            const response = await fetch(
                (language.data == "전체") ?
                    `${API.POST}/postList` : `${API.POST}/postList?language=${language.data}`
            );

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const data = await response.json();
            setPostList(data);
        } catch (error) {
            console.error('Error fetching board list :', error);
        }
        setSplash(false);
    };

    React.useImperativeHandle(ref, () => ({
        fetchBoard: fetchBoard
    }));

    useEffect(() => {
        fetchBoard();
    }, [language]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '스터디 모집 게시판',
            headerTitleStyle: {
                fontFamily: 'Pretendard-Bold',
                fontSize: 18,
                ...Platform.select({
                    android: { marginLeft: 10 }
                })
            },
            headerShadowVisible: false,
            headerLeft: () => (null),
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}
                        onPress={() => parentNav.navigate('BoardSearch')}>
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
                        buttonStyle={{ width: 66, height: 37, marginHorizontal: 5, ...selectButtonStyle.container }}
                        textStyle={selectButtonStyle.text}
                    />
                </ScrollView>
            </View>
            <View style={{ flex: 1, backgroundColor: '#EBEDF6' }}>
                <FlatList
                    data={postList}
                    renderItem={({ item }) => {
                        return (
                            <View style={boardStyle.BoardContanier} >
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 20, paddingVertical: 15 }}
                                    onPress={() => parentNav.navigate('BoardDetail', item)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={boardStyle.TagText}>{item.language}</Text>
                                    </View>
                                    <Text style={boardStyle.TitleText}>{item.postTitle}</Text>
                                    <Text style={boardStyle.InfoText}>모집인원 {item.peopleNum}명 | 주 {item.dayOfWeek}회 | {item.faceToFace == "대면" ? "대면" : "비대면"}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    }
                />
                {splash && <SplashIcon />}
            </View>
            <TouchableOpacity style={boardStyle.WriteButton}
                onPress={() => parentNav.navigate('BoardWrite')}>
                <Octicons name="pencil" size={35} color="#5678F0" />
            </TouchableOpacity>
        </View>
    )
});

export const BoardSearchPage = ({ navigation }) => {
    const [load, setLoad] = React.useState(false);
    const [userInput, setUserInput] = React.useState('');
    const [postList, setPostList] = React.useState([]);

    const serachPost = async () => {
        try {
            const response = await fetch(
                `${API.POST}/searchPost?title=${userInput}`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPostList(data);
        } catch (error) {
            console.error('Error fetching search list :', error);
        }
    };

    const Searching = () => {
        serachPost();
    }
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{ height: '70%', width: 280, marginVertical: 10 }}>
                    <TextInput
                        // value={userInput}
                        // onChangeText={(text) => { setUserInput(text) }}
                        placeholder='검색어를 입력하세요.'
                        style={boardStyle.SearchInputContainer}
                    />
                </View>
            ),
            headerTitleStyle: { display: 'none' },
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}
                        onPress={() => Searching()}>
                        <FontAwesome name="search" size={18} color="#000000" style={{ marginRight: 5 }} />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation]);
    return (
        <View style={{ flex: 1, backgroundColor: '#EBEDF6' }}>
            <FlatList
                style={{ paddingTop: 10 }}
                data={postList}
                renderItem={({ item }) => {
                    return (
                        <View style={boardStyle.BoardContanier} >
                            <TouchableOpacity
                                style={{ paddingHorizontal: 20, paddingVertical: 15 }}
                                onPress={() => navigation.navigate('BoardDetail', item)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={boardStyle.TagText}>{item.language}</Text>
                                </View>
                                <Text style={boardStyle.TitleText}>{item.postTitle}</Text>
                                <Text style={boardStyle.InfoText}>모집인원 {item.chatRoomId.peopleNum}명 | 주 {item.dayOfWeek}회 | {item.faceToFace == '대면' ? '대면' : '비대면'}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                }
            />
        </View>
    )
}

export const BoardScreen = ({ parentNav, navigation }) => {
    const [loaded, error] = useFonts({
        'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
        'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf')
    });

    const boardListRef = React.useRef();
    const isFocused = useIsFocused();
    useEffect(() => {
        setTimeout(() => {
            boardListRef.current.fetchBoard();
        }, 1500);
    }, [isFocused]);

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
                >{(props) => <BoardList ref={boardListRef} parentNav={parentNav} {...props} />}</Stack.Screen>
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
        bottom: 20,
        right: 20,
        borderColor: '#5678F0',
        borderWidth: 3,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
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