// 서버 API 주소 관리
// 시작하기 전에 base url IP주소 수정하고 실행시키기
<<<<<<< HEAD
const BASE_URL = "http://192.168.45.57:8090" 
=======
const BASE_URL = "http://172.30.1.55:8090" 
>>>>>>> e7f8ccb2c08004181ec316f72b8891b2c786477c

export const API = {
    USER:`${BASE_URL}/user`,
    CHAT:`${BASE_URL}/chat`,
    MATCH:`${BASE_URL}/match`,
    POST:`${BASE_URL}/post`,
};