import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';

export default function EditMyInfoScreen({ route, navigation }) {
  const { profile } = route.params;
  const [nationality, setNationality] = useState(profile.nationality);
  const [languages, setLanguages] = useState(profile.languages);
  const [learningLanguages, setLearningLanguages] = useState(profile.learningLanguages);

  const isSaveEnabled = nationality !== "" && languages.length > 0 && learningLanguages.length > 0;

  const handleSave = () => {
    /*
    if (!nationality) {
      Alert.alert('오류', '국적을 선택해야 합니다.');
      return;
    }
    if (languages.length === 0) {
      Alert.alert('오류', '구사 가능 언어를 최소 하나 이상 선택해야 합니다.');
      return;
    }
    if (learningLanguages.length === 0) {
      Alert.alert('오류', '희망 학습 언어를 최소 하나 이상 선택해야 합니다.');
      return;
    }
      */

    const updatedProfile = {
      ...profile,
      nationality,
      languages,
      learningLanguages,
    };

    console.log('Profile updated:', updatedProfile); 
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
      <View style={styles.inputContainer}>
        <Text style={styles.label}>국적</Text>
        <Picker
          selectedValue={nationality}
          onValueChange={(itemValue) => setNationality(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="국적 선택" value="" />
          <Picker.Item label="대한민국" value="대한민국" />
          <Picker.Item label="아프가니스탄" value="아프가니스탄" />
          <Picker.Item label="알바니아" value="알바니아" />
          <Picker.Item label="알제리" value="알제리" />
          <Picker.Item label="안도라" value="안도라" />
          <Picker.Item label="앙골라" value="앙골라" />
          <Picker.Item label="앤티가 바부다" value="앤티가 바부다" />
          <Picker.Item label="아르헨티나" value="아르헨티나" />
          <Picker.Item label="아르메니아" value="아르메니아" />
          <Picker.Item label="오스트레일리아" value="오스트레일리아" />
          <Picker.Item label="오스트리아" value="오스트리아" />
          <Picker.Item label="아제르바이잔" value="아제르바이잔" />
          <Picker.Item label="바하마" value="바하마" />
          <Picker.Item label="바레인" value="바레인" />
          <Picker.Item label="방글라데시" value="방글라데시" />
          <Picker.Item label="바베이도스" value="바베이도스" />
          <Picker.Item label="벨로루시" value="벨로루시" />
          <Picker.Item label="벨기에" value="벨기에" />
          <Picker.Item label="벨리즈" value="벨리즈" />
          <Picker.Item label="베냉" value="베냉" />
          <Picker.Item label="부탄" value="부탄" />
          <Picker.Item label="볼리비아" value="볼리비아" />
          <Picker.Item label="보스니아 헤르체고비나" value="보스니아 헤르체고비나" />
          <Picker.Item label="보츠와나" value="보츠와나" />
          <Picker.Item label="브라질" value="브라질" />
          <Picker.Item label="브루나이" value="브루나이" />
          <Picker.Item label="불가리아" value="불가리아" />
          <Picker.Item label="부르키나 파소" value="부르키나 파소" />
          <Picker.Item label="부룬디" value="부룬디" />
          <Picker.Item label="캄보디아" value="캄보디아" />
          <Picker.Item label="카메룬" value="카메룬" />
          <Picker.Item label="캐나다" value="캐나다" />
          <Picker.Item label="카보베르데" value="카보베르데" />
          <Picker.Item label="중앙아프리카 공화국" value="중앙아프리카 공화국" />
          <Picker.Item label="차드" value="차드" />
          <Picker.Item label="칠레" value="칠레" />
          <Picker.Item label="중화인민공화국" value="중화인민공화국" />
          <Picker.Item label="콜롬비아" value="콜롬비아" />
          <Picker.Item label="코모로" value="코모로" />
          <Picker.Item label="코스타리카" value="코스타리카" />
          <Picker.Item label="코트디부아르" value="코트디부아르" />
          <Picker.Item label="크로아티아" value="크로아티아" />
          <Picker.Item label="키프로스" value="키프로스" />
          <Picker.Item label="체코" value="체코" />
          <Picker.Item label="덴마크" value="덴마크" />
          <Picker.Item label="지부티" value="지부티" />
          <Picker.Item label="도미니카 공화국" value="도미니카 공화국" />
          <Picker.Item label="동티모르" value="동티모르" />
          <Picker.Item label="에콰도르" value="에콰도르" />
          <Picker.Item label="이집트" value="이집트" />
          <Picker.Item label="엘살바도르" value="엘살바도르" />
          <Picker.Item label="적도 기니" value="적도 기니" />
          <Picker.Item label="에리트레아" value="에리트레아" />
          <Picker.Item label="에스토니아" value="에스토니아" />
          <Picker.Item label="에스와티니" value="에스와티니" />
          <Picker.Item label="에티오피아" value="에티오피아" />
          <Picker.Item label="피지" value="피지" />
          <Picker.Item label="핀란드" value="핀란드" />
          <Picker.Item label="프랑스" value="프랑스" />
          <Picker.Item label="가봉" value="가봉" />
          <Picker.Item label="감비아" value="감비아" />
          <Picker.Item label="조지아" value="조지아" />
          <Picker.Item label="독일" value="독일" />
          <Picker.Item label="가나" value="가나" />
          <Picker.Item label="그리스" value="그리스" />
          <Picker.Item label="과테말라" value="과테말라" />
          <Picker.Item label="기니" value="기니" />
          <Picker.Item label="기니비사우" value="기니비사우" />
          <Picker.Item label="가이아나" value="가이아나" />
          <Picker.Item label="아이티" value="아이티" />
          <Picker.Item label="온두라스" value="온두라스" />
          <Picker.Item label="헝가리" value="헝가리" />
          <Picker.Item label="아이슬란드" value="아이슬란드" />
          <Picker.Item label="인도" value="인도" />
          <Picker.Item label="인도네시아" value="인도네시아" />
          <Picker.Item label="이란" value="이란" />
          <Picker.Item label="이라크" value="이라크" />
          <Picker.Item label="아일랜드" value="아일랜드" />
          <Picker.Item label="이스라엘" value="이스라엘" />
          <Picker.Item label="이탈리아" value="이탈리아" />
          <Picker.Item label="자메이카" value="자메이카" />
          <Picker.Item label="일라크" value="일라크" />
          <Picker.Item label="일본" value="일본" />
          <Picker.Item label="요르단" value="요르단" />
          <Picker.Item label="카자흐스탄" value="카자흐스탄" />
          <Picker.Item label="케냐" value="케냐" />
          <Picker.Item label="키리바시" value="키리바시" />
          <Picker.Item label="코소보" value="코소보" />
          <Picker.Item label="쿠웨이트" value="쿠웨이트" />
          <Picker.Item label="키르기스스탄" value="키르기스스탄" />
          <Picker.Item label="라오스" value="라오스" />
          <Picker.Item label="라트비아" value="라트비아" />
          <Picker.Item label="레바논" value="레바논" />
          <Picker.Item label="레소토" value="레소토" />
          <Picker.Item label="리투아니아" value="리투아니아" />
          <Picker.Item label="룩셈부르크" value="룩셈부르크" />
          <Picker.Item label="마다가스카르" value="마다가스카르" />
          <Picker.Item label="말라위" value="말라위" />
          <Picker.Item label="말레이시아" value="말레이시아" />
          <Picker.Item label="몰디브" value="몰디브" />
          <Picker.Item label="말리" value="말리" />
          <Picker.Item label="몰타" value="몰타" />
          <Picker.Item label="모리타니" value="모리타니" />
          <Picker.Item label="모리셔스" value="모리셔스" />
          <Picker.Item label="멕시코" value="멕시코" />
          <Picker.Item label="미크로네시아" value="미크로네시아" />
          <Picker.Item label="모잠비크" value="모잠비크" />
          <Picker.Item label="미얀마" value="미얀마" />
          <Picker.Item label="나미비아" value="나미비아" />
          <Picker.Item label="네팔" value="네팔" />
          <Picker.Item label="네덜란드" value="네덜란드" />
          <Picker.Item label="뉴질랜드" value="뉴질랜드" />
          <Picker.Item label="니카라과" value="니카라과" />
          <Picker.Item label="니제르" value="니제르" />
          <Picker.Item label="나이지리아" value="나이지리아" />
          <Picker.Item label="노르웨이" value="노르웨이" />
          <Picker.Item label="오만" value="오만" />
          <Picker.Item label="파키스탄" value="파키스탄" />
          <Picker.Item label="파나마" value="파나마" />
          <Picker.Item label="파라과이" value="파라과이" />
          <Picker.Item label="페루" value="페루" />
          <Picker.Item label="필리핀" value="필리핀" />
          <Picker.Item label="폴란드" value="폴란드" />
          <Picker.Item label="포르투갈" value="포르투갈" />
          <Picker.Item label="카타르" value="카타르" />
          <Picker.Item label="루마니아" value="루마니아" />
          <Picker.Item label="러시아" value="러시아" />
          <Picker.Item label="르완다" value="르완다" />
          <Picker.Item label="세인트키츠 네비스" value="세인트키츠 네비스" />
          <Picker.Item label="세인트루시아" value="세인트루시아" />
          <Picker.Item label="세인트빈센트 그레나딘" value="세인트빈센트 그레나딘" />
          <Picker.Item label="사우디아라비아" value="사우디아라비아" />
          <Picker.Item label="세네갈" value="세네갈" />
          <Picker.Item label="세르비아" value="세르비아" />
          <Picker.Item label="세이셸" value="세이셸" />
          <Picker.Item label="시에라리온" value="시에라리온" />
          <Picker.Item label="싱가포르" value="싱가포르" />
          <Picker.Item label="슬로바키아" value="슬로바키아" />
          <Picker.Item label="슬로베니아" value="슬로베니아" />
          <Picker.Item label="솔로몬 제도" value="솔로몬 제도" />
          <Picker.Item label="소말리아" value="소말리아" />
          <Picker.Item label="남아프리카 공화국" value="남아프리카 공화국" />
          <Picker.Item label="남수단" value="남수단" />
          <Picker.Item label="스페인" value="스페인" />
          <Picker.Item label="스리랑카" value="스리랑카" />
          <Picker.Item label="수단" value="수단" />
          <Picker.Item label="스웨덴" value="스웨덴" />
          <Picker.Item label="스위스" value="스위스" />
          <Picker.Item label="시리아" value="시리아" />
          <Picker.Item label="타지키스탄" value="타지키스탄" />
          <Picker.Item label="탄자니아" value="탄자니아" />
          <Picker.Item label="태국" value="태국" />
          <Picker.Item label="토고" value="토고" />
          <Picker.Item label="트리니다드 토바고" value="트리니다드 토바고" />
          <Picker.Item label="튀니지" value="튀니지" />
          <Picker.Item label="터키" value="터키" />
          <Picker.Item label="투르크메니스탄" value="투르크메니스탄" />
          <Picker.Item label="우간다" value="우간다" />
          <Picker.Item label="우크라이나" value="우크라이나" />
          <Picker.Item label="아랍에미리트" value="아랍에미리트" />
          <Picker.Item label="영국" value="영국" />
          <Picker.Item label="미국" value="미국" />
          <Picker.Item label="우루과이" value="우루과이" />
          <Picker.Item label="우즈베키스탄" value="우즈베키스탄" />
          <Picker.Item label="바티칸 시국" value="바티칸 시국" />
          <Picker.Item label="베네수엘라" value="베네수엘라" />
          <Picker.Item label="베트남" value="베트남" />
          <Picker.Item label="예멘" value="예멘" />
          <Picker.Item label="잔지바르" value="잔지바르" />
          <Picker.Item label="짐바브웨" value="짐바브웨" />
        </Picker>
      </View>
      <View style={styles.inputContainer}>
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
      </View>
      <View style={styles.inputContainer}>
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
      </View>
      <TouchableOpacity
      style={[styles.customButton, { backgroundColor: isSaveEnabled ? '#5678F0' : '#C7D2F5' }]}
      onPress={handleSave}
      disabled={!isSaveEnabled}
      >
    <Text style={styles.buttonText}>완료하기</Text>
</TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#EBEDF6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 60, 
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 4,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
  },
  picker: {
    width: '100%',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
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
  customButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
