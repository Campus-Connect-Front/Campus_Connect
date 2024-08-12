import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Text, Alert } from 'react-native';
import { API } from '../../config';

export default function LoginScreen({ navigation }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!studentId || !password) {
      Alert.alert("로그인 실패", "아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API.USER}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: studentId,
          password: password,
        }).toString(),
      });

      // 서버 응답을 텍스트로 읽기
      const textResponse = await response.text();

      // 실패
      if (textResponse.includes("Invalid credentials") || textResponse.includes("Please sign in")) {
        setError('아이디(학번) 또는 비밀번호가 올바르지 않습니다.');
        Alert.alert("로그인 실패", '아이디(학번) 또는 비밀번호가 올바르지 않습니다.');
      } else {
        // 로그인 성공
        console.log('Login successful');
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('네트워크 오류 발생:', error);
      setError('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
      Alert.alert("로그인 실패", "네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    }

    setLoading(false);
  };

  const isLoginButtonDisabled = !(studentId && password);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        {loading && <Text>Loading...</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>회원가입</Text>
        </TouchableOpacity>
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
  signupText: {
    marginTop: 16,
    fontSize: 14,
    color: '#5678F0',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
});