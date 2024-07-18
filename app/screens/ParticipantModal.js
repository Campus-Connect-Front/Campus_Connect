import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import { ReportScr } from './reportScr';
import { ExitModal } from './exitModal'; // ExitModal 컴포넌트 추가

export const ParticipantModal = ({ isVisible, onClose, participants }) => {
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isExitVisible, setIsExitVisible] = useState(false); // ExitModal 상태 추가

  const handleReportPress = (participant) => {
    setSelectedParticipant(participant);
    setIsReportVisible(true);
  };

  const handleReportClose = () => {
    setIsReportVisible(false);
    setSelectedParticipant(null);
  };

  const handleReportSubmit = (reportText) => {
    console.log(`Report submitted for ${selectedParticipant.name}: ${reportText}`);
    setIsReportVisible(false);
    setSelectedParticipant(null);
  };

  const handleExitPress = () => {
    setIsExitVisible(true); // ExitModal 표시
  };

  const handleExitClose = () => {
    setIsExitVisible(false);
  };

  const handleExitConfirm = () => {
    console.log('User exited the chat');
    setIsExitVisible(false);
    onClose(); // 모달 닫기
  };

  const renderParticipant = ({ item }) => (
    <View style={styles.participantContainer}>
      <Image source={item.profileImage} style={styles.participantImage} />
      <Text style={styles.participantName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleReportPress(item)}>
        <Icon name="report" size={20} color="#333" style={styles.importIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>대화상대</Text>
          <FlatList
            data={participants}
            renderItem={renderParticipant}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.participantList}
          />
          <View style={styles.exitContainer}>
            <TouchableOpacity onPress={handleExitPress}>
              <Icon name="exit-to-app" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ReportScr
        visible={isReportVisible}
        onClose={handleReportClose}
        onSubmit={handleReportSubmit}
      />

      <ExitModal
        visible={isExitVisible}
        onClose={handleExitClose}
        onExit={handleExitConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '70%',
    height: '100%',
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  participantList: {
    width: '100%',
  },
  participantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  participantName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  importIcon: {
    marginLeft: 10,
  },
  exitContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 5,
  },
});

export default ParticipantModal;
