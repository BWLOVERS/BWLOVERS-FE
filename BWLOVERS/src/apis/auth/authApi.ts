import { axiosInstance } from '@/apis/axiosInstance';

type LoginWithNaverRequest = {
  code: string;
  state: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  isNew: boolean;
};

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
  }
};
