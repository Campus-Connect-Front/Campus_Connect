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

    const showAlert = (title, message) => {
        Alert.alert(title, message);
    };

    const validateInputs = () => {
        if (studentId.length !== 8) {
            showAlert("학번 오류", "학번은 8자리에 맞게 작성해 주세요.");
            return false;
        }
        if (department.length < 2 || department.length > 30) {
            showAlert("학과 글자수 오류", "학과는 2글자 이상, 30자 이하로 작성해 주세요.");
            return false;
        }
        if (name.length < 2 || name.length > 18) {
            showAlert("이름 글자수 오류", "이름은 2글자 이상, 18자 이하로 작성해 주세요.");
            return false;
        }
        return true;
    };

    const handleVerification = async () => {
        if (!validateInputs()) {
            return;
        }

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
            } else {
                handleVerificationError(result);
            }
        } catch (error) {
            console.error('Error during verification:', error);
            handleVerificationError("인증 중 오류가 발생했습니다.");
        }
    };

    const handleVerificationError = (message) => {
        setVerificationModalVisible(false);
        showAlert("인증 실패", message);
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
                        maxLength={8}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.fieldName}>학과</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="학과"
                        value={department}
                        onChangeText={setDepartment}
                        maxLength={30}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.fieldName}>이름</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="이름"
                        value={name}
                        onChangeText={setName}
                        maxLength={18}
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
