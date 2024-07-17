import { useFonts } from 'expo-font';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { infoBoxStyles } from '../assets/styles/globalStyles';
import DoneButton from '../components/DoneButton';

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
            <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={style.TitleText}>Campus</Text>
                <Text style={style.TitleText}>Connect!</Text>
                <Image style={{ marginTop: 20 }} source={require('../assets/images/circle_logo_image.png')} />
            </View>
            <View style={{ flex: 4 }}>
                <View style={infoBoxStyles.boxContainer}>
                    <View style={infoBoxStyles.boxTitleContiner}>
                        <Text style={infoBoxStyles.boxTitleText}>스터디 정보</Text>
                    </View>
                    <View style={infoBoxStyles.tableContainer}>
                        <View style={infoBoxStyles.tableRowContainer_top}>
                            <View style={infoBoxStyles.tableTitleContainer}>
                                <Text style={infoBoxStyles.tableTitleText}>방제</Text>
                            </View>
                            <View style={infoBoxStyles.tableContentContainer}>
                                <Text style={infoBoxStyles.tableContentText}>영어 AtoZ</Text>
                            </View>
                        </View>
                        <View style={infoBoxStyles.tableRowContainer_middle}>
                            <View style={infoBoxStyles.tableTitleContainer}>
                                <Text style={infoBoxStyles.tableTitleText}>인원</Text>
                            </View>
                            <View style={infoBoxStyles.tableContentContainer}>
                                <Text style={infoBoxStyles.tableContentText}>5/6</Text>
                            </View>
                        </View>
                        <View style={infoBoxStyles.tableRowContainer_bottom}>
                            <View style={infoBoxStyles.tableTitleContainer}>
                                <Text style={infoBoxStyles.tableTitleText_small}>스터디 언어</Text>
                            </View>
                            <View style={infoBoxStyles.tableContentContainer}>
                                <Text style={infoBoxStyles.tableContentText}>영어</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <DoneButton text='채팅 시작하기' containerStyle={{ marginBottom: 70 }} />
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