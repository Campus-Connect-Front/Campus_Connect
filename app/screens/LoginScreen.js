import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 로직 추가
    if (studentId && password) {
      navigation.navigate('Main');
    }
  };

  const isLoginButtonDisabled = !(studentId && password); // 아이디와 비밀번호가 모두 입력되지 않으면 버튼 비활성화

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.inputContainer}>
        <Text style={styles.fieldName}>아이디(학번)</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디(학번)"
          value={studentId}
          onChangeText={setStudentId}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.fieldName}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        style={[styles.customButton, isLoginButtonDisabled && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoginButtonDisabled}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>
    </View>
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
  signupText: {
    marginTop: 16,
    fontSize: 14,
    color: '#5678F0',
    textAlign: 'center',
  },
});
