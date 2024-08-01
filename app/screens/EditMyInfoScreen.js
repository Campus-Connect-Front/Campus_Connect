import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements'; // 추가

export default function EditMyInfoScreen({ route, navigation }) {
  const { profile } = route.params;
  const [nationality, setNationality] = useState(profile.nationality);
  const [languages, setLanguages] = useState(profile.languages);
  const [learningLanguages, setLearningLanguages] = useState(profile.learningLanguages);

  const handleSave = () => {
    // 저장 로직 추가
    navigation.goBack();
  };

  const toggleLanguage = (language) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter((lang) => lang !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };

  const toggleLearningLanguage = (language) => {
    if (learningLanguages.includes(language)) {
      setLearningLanguages(learningLanguages.filter((lang) => lang !== language));
    } else {
      setLearningLanguages([...learningLanguages, language]);
    }
  };

  const languageOptions = [
    { label: '한국어', value: '한국어' },
    { label: '영어', value: '영어' },
    { label: '중국어', value: '중국어' },
    { label: '일본어', value: '일본어' },
    { label: '불어', value: '불어' },
    { label: '스페인어', value: '스페인어' },
    { label: '기타', value: '기타' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>국적</Text>
      <Picker selectedValue={nationality} onValueChange={(itemValue) => setNationality(itemValue)}>
        <Picker.Item label="한국" value="한국" />
        <Picker.Item label="미국" value="미국" />
        {/* 다른 옵션들 추가 */}
      </Picker>
      <Text style={styles.label}>구사 가능 언어</Text>
      {languageOptions.map((option, index) => (
        <CheckBox
          key={index}
          title={option.label}
          checked={languages.includes(option.value)}
          onPress={() => toggleLanguage(option.value)}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxLabel}
        />
      ))}
      <Text style={styles.label}>희망 학습 언어</Text>
      {languageOptions.map((option, index) => (
        <CheckBox
          key={index}
          title={option.label}
          checked={learningLanguages.includes(option.value)}
          onPress={() => toggleLearningLanguage(option.value)}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxLabel}
        />
      ))}
      <Button title="완료하기" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    marginVertical: -8,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
});
