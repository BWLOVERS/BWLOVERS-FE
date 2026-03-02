import { axiosInstance } from '@/apis/axiosInstance';
import { tokenStorage } from './tokenStorage';

type LoginWithNaverRequest = {
  code: string;
  state: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  isNew: boolean;
};

type RefreshRequest = { refreshToken: string };
type RefreshResponse = { accessToken: string; refreshToken: string };

export const authApi = {
  async loginWithNaver(body: LoginWithNaverRequest) {
    const { data } = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      body
    );
    return data;
  },

  async withdraw() {
    await axiosInstance.delete('/users/withdraw');
  },

  async refresh() {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refreshToken');

    const { data } = await axiosInstance.post<RefreshResponse>(
      '/auth/refresh',
      { refreshToken } satisfies RefreshRequest,
      { _isRefreshRequest: true } as any
    );

    tokenStorage.set(data.accessToken, data.refreshToken);
    return data;
  }
};
