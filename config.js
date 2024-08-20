// 서버 API 주소 관리
// 시작하기 전에 base url IP주소 수정하고 실행시키기

const BASE_URL = "http://13.209.69.251:8090" 

3
export const API = {
    USER:`${BASE_URL}/user`,
    CHAT:`${BASE_URL}/chat`,
    MATCH:`${BASE_URL}/match`,
    POST:`${BASE_URL}/post`,
};
