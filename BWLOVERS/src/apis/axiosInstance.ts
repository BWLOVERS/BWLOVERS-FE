import axios from 'axios';
import { tokenStorage } from '@/apis/auth/tokenStorage';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log('[REQ]', config.method?.toUpperCase(), config.url);
    console.log(
      '  Authorization:',
      config.headers.Authorization ? '✅ set' : '❌ empty'
    );
    console.log('  Data:', config.data);
  }

  return config;
});

//응답 확인
axiosInstance.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      console.log('[RES]', res.config.url, res.status, res.data);
    }
    return res;
  },
  (err) => {
    if (import.meta.env.DEV) {
      console.log(
        '[ERR]',
        err.config?.url,
        err.response?.status,
        err.response?.data
      );
    }
    return Promise.reject(err);
  }
);
