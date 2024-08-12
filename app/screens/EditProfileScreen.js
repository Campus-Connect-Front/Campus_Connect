import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API } from '../../config';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\./g, '.');
};

export default function EditProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    nickname: '',
    department: '',
    birthdate: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('profile');
        if (profileData) {
          const savedProfile = JSON.parse(profileData);
          setProfile(prevProfile => ({
            ...prevProfile,
            nickname: savedProfile.nickname || '',
            department: savedProfile.department || '',
            birthdate: savedProfile.birthdate ? new Date(savedProfile.birthdate) : new Date(),
          }));
        }
      } catch (error) {
        console.error('프로필 로드 실패:', error);
      }
    };
    loadProfile();
  }, []);

  const isSaveButtonDisabled = !profile.oldPassword;

  const handleSave = async () => {
    if (profile.newPassword.length !== 0 && profile.nickname.length > 12) {
      Alert.alert('닉네임 글자수 오류', '닉네임은 12자 이내로 작성해 주세요.');
      return;
    }

    if (profile.newPassword.length !== 0 && (profile.department.length < 2 || profile.department.length > 30)) {
      Alert.alert('학과 글자수 오류', '학과는 2글자 이상, 30자 이하로 작성해 주세요.');
      return;
    }

    if (profile.newPassword.length !== 0 && profile.newPassword.length < 10) {
      Alert.alert('비밀번호 오류', '비밀번호는 최소 10자리 이상이어야 합니다.');
      return;
    }

    if (profile.newPassword !== profile.confirmPassword) {
      Alert.alert('비밀번호 오류', '새 비밀번호와 재입력한 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const requestBody = {
        usersDTO: {
          nickName: profile.nickname || null,
          password: profile.newPassword || null,
          birthday: profile.birthdate ? profile.birthdate.toISOString() : null,
        },
        userAuthenticationDTO: {
          major: profile.department || null,
        },
        currentPassword: profile.oldPassword || null,
      };      

      console.log('서버로 보내는 데이터:', requestBody);
      console.log('기존 비밀번호:', profile.oldPassword);

      const response = await fetch(`${API.USER}/mypage/edit_userInfo?password=${profile.oldPassword}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('서버 응답 오류:', errorData);
        Alert.alert('오류', errorData.message || '서버 응답 중 문제가 발생했습니다.');
        return;
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);
      Alert.alert('변경 완료', '정보 변경이 완료되었습니다.');
      navigation.goBack();

    } catch (error) {
      console.error('정보 변경 실패:', error);
      Alert.alert('오류', '정보 변경 중 문제가 발생했습니다.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setProfile({ ...profile, birthdate: selectedDate });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>기존 비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="기존 비밀번호"
              secureTextEntry
              value={profile.oldPassword}
              onChangeText={(text) => setProfile({ ...profile, oldPassword: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>새 비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호"
              secureTextEntry
              value={profile.newPassword}
              onChangeText={(text) => setProfile({ ...profile, newPassword: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 재입력</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 재입력"
              secureTextEntry
              value={profile.confirmPassword}
              onChangeText={(text) => setProfile({ ...profile, confirmPassword: text })}
            />
          </View>

          <View style={styles.spacing} />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.input}
              placeholder="닉네임(12자 이내)"
              value={profile.nickname}
              maxLength={12}
              onChangeText={(text) => setProfile({ ...profile, nickname: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>학과</Text>
            <TextInput
              style={styles.input}
              placeholder="학과"
              value={profile.department}
              maxLength={30}
              onChangeText={(text) => setProfile({ ...profile, department: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>생년월일</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{formatDate(profile.birthdate)}</Text> 
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={profile.birthdate} 
                mode="date"
                display="default"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            )}
          </View>
        </View>

        <View style={styles.spacing} />

        <TouchableOpacity 
          style={[styles.saveButton, isSaveButtonDisabled && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isSaveButtonDisabled}
        >
          <Text style={styles.saveButtonText}>변경하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    width: '95%',
    maxWidth: 320,
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 4,
    alignSelf: 'flex-start',
  },
  input: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    fontSize: 16,
    width: '100%',
  },
  datePickerButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerText: {
    fontSize: 16,
  },
  datePicker: {
    width: '100%',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#5678F0',
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 60,
    alignSelf: 'center',
    width: '95%',
    maxWidth: 320,
  },
  saveButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacing: {
    marginBottom: 40,
  },
});
