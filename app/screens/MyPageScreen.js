import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import InfoTableBox from '../components/InfoTableBox';
import { miniLanguageBox } from '../assets/styles/globalStyles';
import {API} from '../../config'

export default function MyPageScreen({ navigation }) {
  const [profile, setProfile] = useState({
    university: '',
    nickname: '',
    birthdate: '',
    department: '',
    studentId: '',
    nationality: '',
    languages: [],
    learningLanguages: [],
  });

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // 유저 정보 띄우기 
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
            department: data.userAuthenticationDTO.major || prevProfile.department,
            studentId: data.userAuthenticationDTO.studentId || prevProfile.studentId,
            nationality: data.usersDTO.nationality || prevProfile.nationality,
            languages: data.availableLangDTO.map(lang => lang.lang) || prevProfile.languages,
            learningLanguages: data.desiredLangDTO.map(lang => lang.lang) || prevProfile.learningLanguages,
            imgUrl: data.usersDTO.imgUrl || prevProfile.imgUrl,
        }));
        // 프로필 이미지 띄우기
        loadProfileImage(data.usersDTO.imgUrl);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

      const unsubscribe = navigation.addListener('focus', () => {
      loadProfile(); 
    });

    return unsubscribe;
  }, [navigation]);

  const loadProfileImage = async (imgUrl) => {
    if (!imgUrl) console.log("파일이 없습니다");
    try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API.USER}/images/${imgUrl}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const imageUri = response.url;
        setProfileImage(imageUri);
    } catch (error) {
        console.error('Failed to load profile image:', error);
    }
  };


  // 프로필 이미지 수정하기
  const pickImage = async () => {
    // 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === 
      false) {
      Alert.alert("권한이 필요합니다.", "프로필 이미지를 변경하려면 갤러리 접근 권한이 필요합니다.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri; // 선택한 이미지 URI
      setProfileImage(selectedImage);
      await uploadImage(selectedImage);
      await AsyncStorage.setItem('profileImage', selectedImage); // AsyncStorage에 저장
    }
  };
  // 서버에 이미지 저장
  const uploadImage = async (imageUri) => {
    const userToken = await AsyncStorage.getItem('userToken');

    const formData = new FormData();
    formData.append('file', {
        uri: imageUri,
        type: 'image', // 혹은 'image/png'
        name: 'profile', // 실제로는 파일 이름이 필요할 수 있습니다.
    });

    try {
        const response = await fetch(`${API.USER}/mypage/edit_profileImg`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
            body: formData,
        });
        if (response.ok) {
            console.log('이미지가 성공적으로 업로드되었습니다:');
            // 성공 시 프로필 이미지를 다시 로드
            await loadProfileImage(imageUri);
        } else {
            console.error('이미지 업로드 실패:');
            Alert.alert('오류', data); // 오류 메시지 표시
        }
    } catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
        Alert.alert('오류', '이미지 업로드 중 문제가 발생했습니다.');
    }
};

  const handleImageChange = () => {
    if (profileImage === null) {
      // 기본 이미지일 때: 앨범에서 사진 선택만 제공
      Alert.alert(
        "프로필 사진 설정",
        "앨범에서 프로필 이미지로 등록할 사진을 선택하세요.",
        [
          {
            text: "앨범에서 사진 선택",
            onPress: pickImage, // 갤러리로 이동
          },
          {
            text: "취소",
            style: "cancel",
          },
        ]
      );
    } else {
      // 기본 이미지가 아닐 때: 기본 이미지로 변경 또는 앨범에서 사진 선택 제공
      Alert.alert(
        "프로필 사진 설정",
        "기본 이미지로 변경하거나, 앨범에서 사진을 선택하세요.",
        [
          {
            text: "기본 이미지 적용",
            onPress: () => {
              setProfileImage(null); 
              AsyncStorage.removeItem('profileImage'); // AsyncStorage에서 이미지 삭제
            },
          },
          {
            text: "앨범에서 사진 선택",
            onPress: pickImage, // 갤러리로 이동
          },
          {
            text: "취소",
            style: "cancel",
          },
        ]
      );
    }
  };


  // 로그아웃
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
            const userToken = await AsyncStorage.getItem('userToken');

                    try {
                        const response = await fetch(`${API.USER}/logout`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${userToken}`, // 토큰을 포함하여 요청
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            // 서버에서 로그아웃 성공
                            await AsyncStorage.removeItem('userToken'); // AsyncStorage에서 토큰 삭제
                            navigation.navigate('Login'); // 로그인 화면으로 이동
                            console.log('로그아웃되었습니다');
                        } else {
                            const errorData = await response.json();
                            Alert.alert('오류', errorData.message || '로그아웃 중 오류가 발생했습니다.');
                        }
                    } catch (error) {
                        console.error('로그아웃 중 오류 발생:', error);
                        Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
                    }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImageChange} style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../assets/images/circle_logo_image.png')} 
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
    width: 110,
    height: 110,
    borderRadius: 50,
    marginLeft: 5,
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
    marginLeft: 20,
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
