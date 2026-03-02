import { create } from 'zustand';
import {
  userAccountApi,
  type UserMeResponse,
  type UpdateNameRequest
} from '@/apis/users/userAccountApi';

type UserState = {
  me: UserMeResponse | null;
  isLoadingMe: boolean;
  isUploadingProfile: boolean;

  fetchMe: () => Promise<void>;
  updateName: (body: UpdateNameRequest) => Promise<void>;
  updateProfileImage: (file: File) => Promise<void>;
  deleteProfileImage: () => Promise<void>;

  setMe: (me: UserMeResponse | null) => void;
  logout: () => void;
};

export const useUserAccountStore = create<UserState>((set, get) => ({
  me: null,
  isLoadingMe: false,
  isUploadingProfile: false,

  fetchMe: async () => {
    set({ isLoadingMe: true });
    try {
      const me = await userAccountApi.getMe();
      set({ me });
    } finally {
      set({ isLoadingMe: false });
    }
  },

  updateName: async (body) => {
    set({ isLoadingMe: true });
    try {
      const updated = await userAccountApi.updateName(body);

      const prev = get().me;
      if (prev) {
        set({ me: { ...prev, username: updated.username } });
      } else {
        await get().fetchMe();
      }
    } finally {
      set({ isLoadingMe: false });
    }
  },

  updateProfileImage: async (file) => {
    set({ isUploadingProfile: true });
    try {
      await userAccountApi.updateProfileImage(file);

      await get().fetchMe();
    } finally {
      set({ isUploadingProfile: false });
    }
  },

  deleteProfileImage: async () => {
    set({ isUploadingProfile: true });
    try {
      await userAccountApi.deleteProfileImage();
      await get().fetchMe();
    } finally {
      set({ isUploadingProfile: false });
    }
  },

  setMe: (me) => set({ me }),
  logout: () => set({ me: null })
}));
