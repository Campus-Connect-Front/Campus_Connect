// 서버 API 주소 관리
// 시작하기 전에 base url IP주소 수정하고 실행시키기
<<<<<<< HEAD
const BASE_URL = "http://192.168.45.75:8090" 
=======
const BASE_URL = "http://172.30.1.29:8090" 
>>>>>>> 93f001098c5a31d854e8c053fc151b9005f8f32d

export const API = {
    USER:`${BASE_URL}/user`,
    CHAT:`${BASE_URL}/chat`,
    MATCH:`${BASE_URL}/match`,
    POST:`${BASE_URL}/post`,
};