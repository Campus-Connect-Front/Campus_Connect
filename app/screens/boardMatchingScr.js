import { useFonts } from 'expo-font';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
                <Image style={{marginTop: 20}} source={require('../assets/images/circle_logo_image.png')} />
            </View>
            <View style={{ flex: 4 }}>
                <View style={{ backgroundColor: '#ffffff', borderRadius: 10, marginHorizontal: 15 }}>
                    <View style={{ backgroundColor: '#5678F0', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <Text style={{ color: '#ffffff', fontFamily: 'Pretendard-Bold', fontSize: 19, paddingVertical: 12 }}>스터디 정보</Text>
                    </View>
                    <View style={style.TableContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ ...style.TableTitleContainer }}>
                                <Text style={style.TableTitleText}>방제</Text>
                            </View>
                            <View style={{ ...style.TableContentContainer }}>
                                <Text style={style.TableContentText}>영어 AtoZ</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#E0E0E0' }}>
                            <View style={{ ...style.TableTitleContainer }}>
                                <Text style={style.TableTitleText}>인원</Text>
                            </View>
                            <View style={{ ...style.TableContentContainer }}>
                                <Text style={style.TableContentText}>5/6</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ ...style.TableTitleContainer }}>
                                <Text style={{ fontSize: 11, fontFamily: 'Pretendard-Regular' }}>스터디 언어</Text>
                            </View>
                            <View style={{ ...style.TableContentContainer }}>
                                <Text style={style.TableContentText}>영어</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ backgroundColor: '#5678F0', borderRadius: 16, marginBottom: 70 }}>
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: 'Pretendard-Bold',
                        color: '#ffffff',
                        paddingVertical: 15
                    }}>채팅 시작하기</Text>
                </TouchableOpacity>
            </View>
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