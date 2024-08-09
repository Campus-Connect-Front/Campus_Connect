// 서버 API 주소 관리
// 시작하기 전에 base url IP주소 수정하고 실행시키기
const BASE_URL = "http://192.168.123.108:8090" 

export const API = {
    USER:`${BASE_URL}/user`,
    CHAT:`${BASE_URL}/chat`,
    MATCH:`${BASE_URL}/match`,
    POST:`${BASE_URL}/post`,
};