// src/api.ts
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.API_BASE_URL,
});

// 요청 인터셉터: 모든 요청이 보내지기 전에 실행됩니다.
api.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰을 가져옵니다.
    const token = localStorage.getItem("authToken");
    if (token) {
      // 토큰이 있다면, Authorization 헤더에 'Bearer 토큰' 형태로 추가합니다.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
