import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Text, Modal, ActivityIndicator } from 'react-native';

export default function SignupScreen({ navigation }) {
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [name, setName] = useState('');
  const [isVerificationModalVisible, setVerificationModalVisible] = useState(false);
  const [isVerificationComplete, setVerificationComplete] = useState(false);

  const isNextButtonDisabled = !(studentId && department && name);

  const handleVerification = () => {
    setVerificationModalVisible(true);

    // 학번 인증 타이머 2초로 설정
    setTimeout(() => {
      setVerificationComplete(true);
    }, 2000);
  };

  const handleVerificationConfirm = () => {
    setVerificationModalVisible(false);
    navigation.navigate('AdditionalInfo'); 
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
                <ActivityIndicator size="large" color="#5678F0" />
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
});
