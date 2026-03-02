import axios from 'axios';
import { tokenStorage } from '@/apis/auth/tokenStorage';
import { authApi } from '@/apis/auth/authApi';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  if ((config as any)._isRefreshRequest) return config;

  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log('[REQ]', config.method?.toUpperCase(), config.url);
    console.log(
      '  Authorization:',
      (config.headers as any)?.Authorization ? '✅ set' : '❌ empty'
    );
    console.log('  Data:', config.data);
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      console.log('[RES]', res.config.url, res.status, res.data);
    }
    return res;
  },
  async (err) => {
    const originalRequest = err.config as any;
    if (!originalRequest) return Promise.reject(err);

    if (
      originalRequest._isRefreshRequest ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      tokenStorage.clear();
      window.location.href = '/';
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        window.location.href = '/';
        return Promise.reject(err);
      }

      try {
        const { accessToken } = await authApi.refresh();

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

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
