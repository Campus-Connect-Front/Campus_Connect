import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    nickname: '',
    studentId: '',
    department: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    dateOfBirth: new Date(),
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
            studentId: savedProfile.studentId || '',
            department: savedProfile.department || '',
            dateOfBirth: savedProfile.dateOfBirth ? new Date(savedProfile.dateOfBirth) : new Date(),
          }));
        }
      } catch (error) {
        console.error('프로필 로드 실패:', error);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {

    if (profile.newPassword !== profile.confirmPassword) {
      Alert.alert('비밀번호 오류', '새 비밀번호와 재입력한 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const existingProfileData = await AsyncStorage.getItem('profile');
      const existingProfile = existingProfileData ? JSON.parse(existingProfileData) : {};

      if (existingProfile.password !== profile.oldPassword) {
        Alert.alert('비밀번호 오류', '기존 비밀번호가 올바르지 않습니다.');
        return;
      }

      const updatedProfile = {
        ...existingProfile,
        nickname: profile.nickname || existingProfile.nickname,
        studentId: profile.studentId || existingProfile.studentId,
        department: profile.department || existingProfile.department,
        password: profile.newPassword || existingProfile.password,
        dateOfBirth: profile.dateOfBirth.toISOString(),
      };

      await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
      Alert.alert('저장 완료', '프로필 정보가 저장되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('프로필 저장 실패:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setProfile({ ...profile, dateOfBirth: selectedDate });
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isSaveButtonDisabled = !profile.oldPassword;

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
            placeholder="닉네임"
            value={profile.nickname}
            onChangeText={(text) => setProfile({ ...profile, nickname: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>학번</Text>
          <TextInput
            style={styles.input}
            placeholder="학번"
            value={profile.studentId}
            onChangeText={(text) => setProfile({ ...profile, studentId: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>학과</Text>
          <TextInput
            style={styles.input}
            placeholder="학과"
            value={profile.department}
            onChangeText={(text) => setProfile({ ...profile, department: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>생년월일</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{formatDate(profile.dateOfBirth)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={profile.dateOfBirth}
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
    backgroundColor: '#B0B0B0', // Disabled color
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
