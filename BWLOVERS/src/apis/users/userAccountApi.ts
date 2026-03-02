import { axiosInstance } from '@/apis/axiosInstance';

export type UserMeResponse = {
  username: string;
  email: string;
  phone: string;
  profileImage: string | null;
};

export type UpdateNameRequest = {
  username: string;
};

export type UpdateNameResponse = {
  username: string;
};

export const userAccountApi = {
  getMe: async () => {
    const { data } = await axiosInstance.get<UserMeResponse>('/users/me');
    return data;
  },

  updateName: async (body: UpdateNameRequest) => {
    const { data } = await axiosInstance.patch<UpdateNameResponse>(
      '/users/me/username',
      body
    );
    return data;
  },

  updateProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    await axiosInstance.patch('/users/me/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteProfileImage: async () => {
    await axiosInstance.delete('/users/me/profile-image');
  }
};
