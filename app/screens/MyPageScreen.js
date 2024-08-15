import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import InfoTableBox from '../components/InfoTableBox';
import { miniLanguageBox } from '../assets/styles/globalStyles';
import { API } from '../../config';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

import defaultImage from '../assets/images/circle_logo_image.png'; 
const defaultImageUri = Image.resolveAssetSource(defaultImage).uri;

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\./g, '.');
};

const getFileExtension = (uri) => {
  if (uri.endsWith('.jpg')) return '.jpg';
  if (uri.endsWith('.png')) return '.png';
  throw new Error("지원하지 않는 이미지 파일 형식입니다.");
};

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
    imgUrl: '',  
  });

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API.USER}/mypage`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setProfile(prevProfile => ({
          ...prevProfile,
          university: data.usersDTO.university || prevProfile.university,
          nickname: data.usersDTO.nickName || prevProfile.nickname,
          birthdate: formatDate(data.usersDTO.birthday) || prevProfile.birthdate,
          department: data.userAuthenticationDTO.major || prevProfile.department,
          studentId: data.userAuthenticationDTO.studentId || prevProfile.studentId,
          nationality: data.usersDTO.nationality || prevProfile.nationality,
          languages: data.availableLangDTO.map(lang => lang.lang) || prevProfile.languages,
          learningLanguages: data.desiredLangDTO.map(lang => lang.lang) || prevProfile.learningLanguages,
          imgUrl: data.usersDTO.imgUrl || prevProfile.imgUrl,
        }));
        loadProfileImage(data.usersDTO.imgUrl);
      } catch (err) {
        const errorMessage = err?.message || err?.toString() || 'Unknown error occurred'; 
        console.error(
          `Failed to load profile.\n` +
          `Error Message: ${errorMessage}\n` +
          `API Endpoint: ${API.USER}/mypage\n` +
          `User Token: ${userToken ? 'Exists' : 'Missing'}`
        );
    
        Alert.alert('오류', `프로필 정보를 로드하는 중 오류가 발생했습니다: ${errorMessage}`);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const loadProfileImage = async (imgUrl) => {
    console.log("요청할 이미지 URL:", imgUrl);
    if (!imgUrl) {
      console.log("파일이 없습니다");
      setProfileImage(defaultImageUri); 
      return;
    }

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API.USER}/images/${imgUrl}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errormessage = `Failed to load image (HTTP Status: ${response.status} ${response.statusText}) - Image URL: ${imgUrl}`;
        throw new Error(errormessage);
      }

      const imageUri = response.url;
      console.log("서버로부터 받은 이미지 URI:", imageUri);
      setProfileImage(imageUri);
      
    } catch (err) { 
      const errorMessage = err?.message || err?.toString() || 'Unknown error occurred';
      console.error('Failed to load profile image:', errorMessage);
      setProfileImage(defaultImageUri); 
      Alert.alert('오류', `프로필 이미지를 로드하는 중 오류가 발생했습니다: ${errorMessage}`);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
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
      const selectedImage = result.assets[0].uri;
      console.log("선택한 프로필 이미지 URI:", selectedImage);
      await uploadImage(selectedImage); 
    }
  };

  const uploadImage = async (imageUri) => {
    const userToken = await AsyncStorage.getItem('userToken');

    const formData = new FormData();
    const fileExtension = getFileExtension(imageUri);

    formData.append('file', {
        uri: imageUri,
        name: `profile${fileExtension}`,
        type: `image/${fileExtension === '.jpg' ? 'jpeg' : 'png'}`,
    });

    try {
        const response = await fetch(`${API.USER}/mypage/edit_profileImg`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        if (response.ok) {
            setProfileImage(imageUri);
            console.log('이미지 업로드 성공');
        } else {
            const errorData = await response.text();
            console.error('이미지 업로드 실패:', response.status, response.statusText, errorData);
            Alert.alert('오류', `이미지 업로드 중 오류가 발생했습니다: ${errorData}`);
        }             
    } catch (err) {
        const errorMessage = err?.message || err?.toString() || 'Unknown error occurred'; // 'error'에서 'err'로 변경
        console.error('이미지 업로드 중 오류 발생:', errorMessage);
        Alert.alert('오류', `이미지 업로드 중 문제가 발생했습니다: ${errorMessage}`);
    }
  };

  const uploadDefaultImage = async () => {
    try {
      // 기본 이미지 에셋 로드
      const asset = Asset.fromModule(defaultImage);
      await asset.downloadAsync(); // 에셋 다운로드

      const formData = new FormData();
      const base64DefaultImage = await FileSystem.readAsStringAsync(asset.localUri || asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      formData.append('file', {
        uri: asset.localUri || asset.uri,
        name: 'default_image.png',
        type: 'image/png',
      });

      console.log("업로드할 기본 이미지 데이터:", formData);

      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API.USER}/mypage/edit_profileImg`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data', 
        },
        body: formData,
      });

      if (response.ok) {
        console.log("기본 이미지로 변경 성공");
        setProfileImage(defaultImageUri);
      } else {
        const errorData = await response.text();
        console.error("기본 이미지로 변경 실패:", response.status, response.statusText, errorData);
        Alert.alert('오류', `기본 이미지로 변경 중 오류가 발생했습니다: ${response.statusText}`);
      }
    } catch (err) { 
      const errorMessage = err?.message || err?.toString() || 'Unknown error occurred';
      console.error('기본 이미지로 변경 중 오류 발생:', errorMessage);
      Alert.alert('오류', `기본 이미지로 변경 중 문제가 발생했습니다: ${errorMessage}`);
    }
  };

  const handleImageChange = () => {
    if (profileImage === null || profileImage === defaultImageUri) {
      Alert.alert(
        "프로필 사진 설정",
        "앨범에서 프로필 이미지로 등록할 사진을 선택하세요.",
        [
          {
            text: "앨범에서 사진 선택",
            onPress: pickImage,
          },
          {
            text: "취소",
            style: "cancel",
          },
        ]
      );
    } else {
      Alert.alert(
        "프로필 사진 설정",
        "기본 이미지로 변경하거나, 앨범에서 사진을 선택하세요.",
        [
          {
            text: "기본 이미지 적용",
            onPress: uploadDefaultImage,
          },
          {
            text: "앨범에서 사진 선택",
            onPress: pickImage,
          },
          {
            text: "취소",
            style: "cancel",
          },
        ]
      );
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
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              const response = await fetch(`${API.USER}/logout`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${userToken}`,
                  'Content-Type': 'application/json',
                },
              });

              if (response.ok) {
                await AsyncStorage.removeItem('userToken');
                navigation.navigate('LoginStack');
                console.log('로그아웃되었습니다');
              } else {
                const errorData = await response.json();
                Alert.alert('오류', errorData.message || '로그아웃 중 오류가 발생했습니다.');
              }
            } catch (err) { 
              const errorMessage = err?.message || err?.toString() || 'Unknown error occurred'; 
              console.error('로그아웃 중 오류 발생:', errorMessage);
              Alert.alert('오류', `로그아웃 중 문제가 발생했습니다: ${errorMessage}`);
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
        style={{ marginTop: 20, width: '95%', alignSelf: 'center' }}
        title='내 정보'
        tableInfos={[
          {
            title: '국적',
            info: profile.nationality || '로딩 중...',
          },
          {
            title: '구사 가능 언어',
            titleStyle: { fontSize: 12 },
            info: () => (
              <View style={{ flexDirection: 'row' }}>
                {profile.languages.length > 0 ? (
                  profile.languages.map((language) => (
                    <View key={language} style={miniLanguageBox.box}>
                      <Text style={miniLanguageBox.text}>{language}</Text>
                    </View>
                  ))
                ) : (
                  <Text>로딩 중...</Text>
                )}
              </View>
            ),
          },
          {
            title: '희망 학습 언어',
            titleStyle: { fontSize: 12 },
            info: () => (
              <View style={{ flexDirection: 'row' }}>
                {profile.learningLanguages.length > 0 ? (
                  profile.learningLanguages.map((language) => (
                    <View key={language} style={miniLanguageBox.box}>
                      <Text style={miniLanguageBox.text}>{language}</Text>
                    </View>
                  ))
                ) : (
                  <Text>로딩 중...</Text>
                )}
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
    marginRight: 120,
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
    flexWrap: 'wrap',
    flexShrink: 1, 
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
  },
  editProfile: {
    color: '#7F7F7F',
    textDecorationLine: 'underline',
    textAlign: 'right',
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
