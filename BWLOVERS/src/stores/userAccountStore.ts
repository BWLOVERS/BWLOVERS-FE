import { create } from 'zustand';
import {
  userAccountApi,
  type UserMeResponse
} from '@/apis/users/userAccountApi';

type UserState = {
  me: UserMeResponse | null;
  isLoadingMe: boolean;
  fetchMe: () => Promise<void>;
  setMe: (me: UserMeResponse | null) => void;
  clearMe: () => void;
};

export const useUserAccountStore = create<UserState>((set, get) => ({
  me: null,
  isLoadingMe: false,

  fetchMe: async () => {
    // 이미 불러온 상태면 중복 호출 방지(원하면 제거 가능)
    if (get().me) return;

    set({ isLoadingMe: true });
    try {
      const me = await userAccountApi.getMe();
      set({ me });
    } finally {
      set({ isLoadingMe: false });
    }
  },

  setMe: (me) => set({ me }),
  clearMe: () => set({ me: null })
}));
