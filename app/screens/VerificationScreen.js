import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

export default function VerificationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.message}>학번 인증이 완료되었습니다.</Text>
      <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('AdditionalInfo')}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
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
    width: '60%',
    height: undefined,
    aspectRatio: 5000 / 1830,
    marginBottom: 32,
  },
  message: {
    fontSize: 18,
    marginVertical: 16,
  },
  customButton: {
    backgroundColor: '#5678F0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});