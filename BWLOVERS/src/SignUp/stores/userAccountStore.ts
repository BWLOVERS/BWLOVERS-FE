import { create } from 'zustand';
import {
  userAccountApi,
  type UserMeResponse,
  type UpdateMeRequest
} from '@/apis/users/userAccountApi';

type UserState = {
  me: UserMeResponse | null;
  isLoadingMe: boolean;

  fetchMe: () => Promise<void>;
  updateMe: (body: UpdateMeRequest) => Promise<void>;

  setMe: (me: UserMeResponse | null) => void;
  logout: () => void;
};

export const useUserAccountStore = create<UserState>((set) => ({
  me: null,
  isLoadingMe: false,

  fetchMe: async () => {
    set({ isLoadingMe: true });
    try {
      const me = await userAccountApi.getMe();
      set({ me });
    } finally {
      set({ isLoadingMe: false });
    }
  },

  updateMe: async (body) => {
    set({ isLoadingMe: true });
    try {
      const updated = await userAccountApi.updateMe(body);

      set((state) => ({
        me: state.me ? { ...state.me, ...updated } : (updated as UserMeResponse)
      }));
    } finally {
      set({ isLoadingMe: false });
    }
  },

  setMe: (me) => set({ me }),
  logout: () => set({ me: null })
}));
