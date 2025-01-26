// src/utils/auth.js
  
export const isLoggedIn = () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    console.log("-=---")
    console.log(token)
    return !!token; // 토큰이 있으면 true, 없으면 false 반환
};