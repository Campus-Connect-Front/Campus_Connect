import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const MyInfoScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    nickname: '',
    studentId: '',
    department: '',
    birthdate: '',
    name: '',
  });

  const [showModal, setShowModal] = useState(false);

  // 프로필 정보 로드
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API.USER}/mypage`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProfile(prevProfile => ({
          ...prevProfile,
          name: data.userAuthenticationDTO.studentName || prevProfile.name,
          studentId: data.userAuthenticationDTO.studentId || prevProfile.studentId,
          department: data.userAuthenticationDTO.major || prevProfile.department,
          birthdate: formatDate(data.usersDTO.birthday) || prevProfile.birthdate,
          nickname: data.usersDTO.nickName || prevProfile.nickname,
        }));
      } catch (error) {
        Alert.alert('오류', '프로필 정보를 불러오는 데 실패했습니다.');
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => setShowModal(true);

  const handleDeleteAccount = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      
      const response = await fetch(`${API.USER}/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      await AsyncStorage.removeItem('userToken');
      setShowModal(false);
      Alert.alert('알림', '탈퇴가 완료되었습니다.');
      navigation.navigate('LoginStack');
    } catch (error) {
      Alert.alert('오류', '탈퇴하는 데 실패했습니다.');
    }
  };  

  // 값이 없거나 비어 있는 문자열인 경우
  const renderProfileInfo = (value) => {
    return value && value.trim() !== '' ? value : '로딩 중...';
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>내 정보</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>이름</Text>
          <Text style={styles.infoValue}>{renderProfileInfo(profile.name)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>아이디(학번)</Text>
          <Text style={styles.infoValue}>{renderProfileInfo(profile.studentId)}</Text>
        </View>
        <View style={styles.separator} />
        <Text style={styles.sectionTitle}>정보 변경</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>비밀번호 변경</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>닉네임 변경</Text>
            <Text style={styles.infoValueSmall}>{renderProfileInfo(profile.nickname)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>학과 변경</Text>
            <Text style={styles.infoValueSmall}>{renderProfileInfo(profile.department)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>생년월일 변경</Text>
            <Text style={styles.infoValueSmall}>{renderProfileInfo(profile.birthdate)}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Image source={require('../assets/images/logo2.png')} style={styles.logo} />
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.withdraw}>탈퇴하기</Text>
      </TouchableOpacity>
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalClose}>
              <Text>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>탈퇴하기</Text>
            <Text style={styles.modalText}>
              정말로 탈퇴하시겠습니까?{'\n'}그동안 앱에 저장된 내역들은{'\n'}복구되지 않습니다.
            </Text>
            <TouchableOpacity onPress={handleDeleteAccount} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>탈퇴하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEDF6',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 30,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#5678F0',
    textAlign: 'right',
    flex: 1,
  },
  infoValueSmall: {
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'right',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBDB',
    marginVertical: 16,
  },
  logo: {
    width: '40%',
    height: undefined,
    alignSelf: 'center',
    aspectRatio: 5000 / 2800,
    marginTop: 50,
  },
  withdraw: {
    color: '#7F7F7F',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  modalButton: {
    backgroundColor: '#ff4747',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MyInfoScreen;