import { axiosInstance } from '@/apis/axiosInstance';

export type UserMeResponse = {
  username: string;
  email: string;
  phone: string;
  profileImageUrl: string | null;
};

export const userAccountApi = {
  getMe: async () => {
    const { data } = await axiosInstance.get<UserMeResponse>('/users/me');
    return data;
  }
};
