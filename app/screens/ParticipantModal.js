import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import ReportScr from './reportScr'; 
import ExitModal from './exitModal'; 

export const ParticipantModal = ({ isVisible, onClose, participants, userName }) => {
  const [sortedParticipants, setSortedParticipants] = useState([]);

  useEffect(() => {
    const sorted = [participants.find(p => p.name === userName), ...participants.filter(p => p.name !== userName)];
    setSortedParticipants(sorted);
  }, [participants, userName]);

  const [isReportVisible, setIsReportVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isExitVisible, setIsExitVisible] = useState(false);

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
    setIsExitVisible(true);
  };

  const handleExitClose = () => {
    setIsExitVisible(false);
  };

  const handleExitConfirm = () => {
    console.log('User exited the chat');
    setIsExitVisible(false);
    onClose();
  };

  const renderParticipant = ({ item }) => (
    <View style={styles.participantContainer}>
      <Image source={item.profileImage} style={styles.participantImage} />
      <View style={styles.nameContainer}>
        {item.name === userName ? (
          <>
            <View style={styles.myLabelContainer}>
              <Text style={styles.myLabel}>나</Text>
            </View>
            <Text style={styles.participantNameText}>{item.name}</Text>
          </>
        ) : (
          <Text style={styles.participantNameText}>{item.name}</Text>
        )}
      </View>
      {item.name !== userName && (
        <TouchableOpacity onPress={() => handleReportPress(item)}>
          <Icon name="report-gmailerrorred" size={20} color="#333" style={styles.importIcon} />
        </TouchableOpacity>
      )}
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
            data={sortedParticipants}
            renderItem={renderParticipant}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.participantList}
          />
          <View style={styles.exitContainer}>
            <TouchableOpacity onPress={handleExitPress}>
              <Icon name="logout" size={24} color="#fff" />
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  participantNameText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5, 
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
  myLabelContainer: {
    backgroundColor: '#5678F0',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6, 
    marginRight: 5,
  },
  myLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ParticipantModal;
