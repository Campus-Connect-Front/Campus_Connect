import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Text, Modal, ActivityIndicator, Alert } from 'react-native';
import { API } from '../../config';

export default function SignupScreen({ navigation }) {
    const [studentId, setStudentId] = useState('');
    const [department, setDepartment] = useState('');
    const [name, setName] = useState('');
    const [isVerificationModalVisible, setVerificationModalVisible] = useState(false);
    const [isVerificationComplete, setVerificationComplete] = useState(false);

    const isNextButtonDisabled = !(studentId && department && name);

    const handleVerification = async () => {
        setVerificationModalVisible(true);
        try {
            const response = await fetch(`${API.USER}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    major: department,
                    studentName: name,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text(); 
            console.log("인증 응답:", result);

            if (result === "인증되었습니다.") {
                setVerificationComplete(true);
            } else if (result === "재학생 인증 실패: 학번, 이름, 전공이 일치하지 않습니다.") {
                setVerificationModalVisible(false);
                Alert.alert("인증 실패", "해당 정보로 등록된 재학생이 없습니다."); 
            } else if (result === "이미 회원가입한 사용자입니다.") {
                setVerificationModalVisible(false); 
                Alert.alert("인증 실패", "이미 존재하는 사용자입니다.");
            } else {
                setVerificationModalVisible(false); 
                Alert.alert("인증 실패", result);
            }
        } catch (error) {
            console.error('Error during verification:', error);
            setVerificationModalVisible(false);
            Alert.alert("오류", "인증 중 오류가 발생했습니다."); 
        }
    };

    const handleVerificationConfirm = () => {
        setVerificationModalVisible(false);
        navigation.navigate('AdditionalInfo', {
            studentId,
            department,
            name,
        }); 
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
                <View style={styles.inputContainer}>
                    <Text style={styles.fieldName}>학번</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="학번"
                        value={studentId}
                        onChangeText={setStudentId}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.fieldName}>학과</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="학과"
                        value={department}
                        onChangeText={setDepartment}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.fieldName}>이름</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="이름"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.customButton, isNextButtonDisabled && styles.disabledButton]}
                    onPress={handleVerification}
                    disabled={isNextButtonDisabled}
                >
                    <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    visible={isVerificationModalVisible}
                    animationType="slide"
                    onRequestClose={() => setVerificationModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            {!isVerificationComplete ? (
                                <>
                                    <Text style={styles.modalText}>학번 인증 중...</Text>
                                    <View style={styles.activityIndicatorContainer}>
                                        <ActivityIndicator size="large" color="#5678F0" />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.modalText}>학번 인증이 완료되었습니다.</Text>
                                    <TouchableOpacity style={styles.modalButton} onPress={handleVerificationConfirm}>
                                        <Text style={styles.buttonText}>다음</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#EBEDF6',
    },
    logo: {
        width: '80%',
        height: undefined,
        aspectRatio: 5000 / 1830,
        marginBottom: 32,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    fieldName: {
        marginBottom: 8,
        fontSize: 12,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
    },
    customButton: {
        backgroundColor: '#5678F0',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginTop: 16,
        width: '100%',
    },
    disabledButton: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        minHeight: 200, 
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20, 
    },
    modalButton: {
        backgroundColor: '#5678F0',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
    activityIndicatorContainer: {
        marginVertical: 20, 
        alignItems: 'center',
    },
});
