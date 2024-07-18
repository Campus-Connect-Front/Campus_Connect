import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';


export const ReportScr = ({ visible, onClose, onSubmit }) => {
  const [reportText, setReportText] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  const handleSubmit = () => {
    onSubmit(reportText); // onSubmit을 호출
    setAlertVisible(true); // 알림 모달 표시
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    onClose(); // 신고 모달 닫기
    setReportText(''); // 입력 필드 초기화
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>신고하기</Text>
            <Text style={styles.modalText}>이 메시지를 신고하시겠습니까?</Text>
            <TextInput
              style={styles.input}
              placeholder="신고 내용을 입력하세요"
              placeholderTextColor="#999"
              value={reportText}
              onChangeText={setReportText}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>제출하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="fade"
        visible={alertVisible}
        onRequestClose={handleAlertClose}
      >
        <View style={styles.alertContainer}>
          <View style={styles.alertContent}>
            <Text style={styles.alertText}>
                신고 내용을 접수했습니다.{'\n'}
                클린한 서비스를 위해 노력하는 {'\n'}
                cc가 되겠습니다.{'\n'}
                감사합니다.
            </Text>
            <TouchableOpacity style={styles.alertButton} onPress={handleAlertClose}>
              <Text style={styles.alertButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#5678F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#5678F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  alertButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
