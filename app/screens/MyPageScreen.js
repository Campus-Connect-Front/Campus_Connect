import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import InfoTableBox from '../components/InfoTableBox';
import { miniLanguageBox } from '../assets/styles/globalStyles';
import {API} from '../../config'

export default function MyPageScreen({ navigation }) {
  const defaultProfile = {
    university: '성신여자대학교',
    nickname: '닉네임',
    birthdate: '20XX.XX.XX',
    department: '컴퓨터공학과',
    studentId: '20XXXXXX',
    nationality: '한국',
    languages: ['한국어', '영어'], 
    learningLanguages: ['영어', '일본어'], 
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken'); // 로그인한 유저의 토큰 가져오기
        const response = await fetch(`${API.USER}/mypage`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`, // Bearer 토큰을 포함시킴
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProfile(prevProfile => ({
            ...prevProfile,
            university: data.usersDTO.university || prevProfile.university,
            nickname: data.usersDTO.nickName || prevProfile.nickname,
            birthdate: data.usersDTO.birthday || prevProfile.birthdate,
            department: data.usersDTO.department || prevProfile.department,
            studentId: data.usersDTO.studentId || prevProfile.studentId,
            nationality: data.usersDTO.nationality || prevProfile.nationality,
            languages: data.availableLangDTO.map(lang => lang.lang) || prevProfile.languages,
            learningLanguages: data.desiredLangDTO.map(lang => lang.lang) || prevProfile.learningLanguages,
        }));
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
    };

    const loadProfileImage = async () => {
      try {
        const image = await AsyncStorage.getItem('profileImage');
        setProfileImage(image || null);
      } catch (error) {
        console.error('Failed to load profile image:', error);
        setProfileImage(null);
      }
    };

    loadProfile();
    loadProfileImage();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
      await AsyncStorage.setItem('profileImage', result.uri);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../assets/images/default-profile.png')}
              style={styles.profileImage}
            />
          </View>
          <Image source={require('../assets/images/edit-icon.png')} style={styles.editIcon} />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.university}>{profile.university}</Text>
          <Text style={styles.nickname}>{profile.nickname} 님</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyInfo')}>
            <Text style={styles.editProfile}>정보 수정하기</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>생년월일: {profile.birthdate}</Text>
          <Text style={styles.infoText}>학과: {profile.department}</Text>
          <Text style={styles.infoText}>학번: {profile.studentId}</Text>
        </View>
      </View>

      <InfoTableBox
        style={{ marginTop: 20, width: '95%', alignSelf: 'center', }}
        title='내 정보'
        tableInfos={[
          {
            title: '국적',
            info: profile.nationality,
          },
          {
            title: '구사 가능 언어',
            titleStyle: { fontSize: 12 },
            info: () => (
              <View style={{ flexDirection: 'row' }}>
                {profile.languages.map((language, index) => (
                  <View key={index} style={miniLanguageBox.box}>
                    <Text style={miniLanguageBox.text}>{language}</Text>
                  </View>
                ))}
              </View>
            ),
          },
          {
            title: '희망 학습 언어',
            titleStyle: { fontSize: 12 },
            info: () => (
              <View style={{ flexDirection: 'row' }}>
                {profile.learningLanguages.map((language, index) => (
                  <View key={index} style={miniLanguageBox.box}>
                    <Text style={miniLanguageBox.text}>{language}</Text>
                  </View>
                ))}
              </View>
            ),
          },
        ]}
        showAdditionalButton={true}
        buttonText='변경하기'
        buttonOnPress={() => navigation.navigate('EditMyInfo', { profile })}
      />

      <Image source={require('../assets/images/logo2.png')} style={styles.logo} />
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>로그아웃하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EBEDF6',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  profileInfo: {
    marginLeft: 30,
    width: '90%',
  },
  university: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  nickname: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
  },
  editProfile: {
    color: '#7F7F7F',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 5,
  },
  logo: {
    width: '50%',
    height: undefined,
    alignSelf: 'center',
    aspectRatio: 5000 / 2800,
    marginTop: 30,
    marginBottom: 10,
  },
  logout: {
    color: '#7F7F7F',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
