import { create } from 'zustand';
import { pregnancyInfoApi } from '@/apis/users/pregnancyInfoApi';

export type ToggleValue = 'yes' | 'no' | null;

export type PregnancyInfoDraft = {
  birthDate: string;
  jobName: string;
  expectedDate: string;
  height: string;
  weightPre: string;
  weightCurrent: string;
  gestationalWeek: string;
  isFirstbirth: ToggleValue;
  isMultiplePregnancy: ToggleValue;
  miscarriageHistory: ToggleValue;
  miscarriageCount: string;
};

export type PregnancyInfoResponse = {
  infoId: number;
  userId: number;
  birthDate: string;
  height: number;
  weightPre: number;
  weightCurrent: number;
  isFirstbirth: boolean;
  gestationalWeek: number;
  expectedDate: string;
  isMultiplePregnancy: boolean;
  miscarriageHistory: number;
  job: {
    jobId: number;
    jobName: string;
    riskLevel: number;
  };
};

type PregnancyInfoStore = {
  draft: PregnancyInfoDraft;

  server: PregnancyInfoResponse | null;
  isLoading: boolean;
  error: unknown | null;

  setDraft: (partial: Partial<PregnancyInfoDraft>) => void;

  setDraftField: <K extends keyof PregnancyInfoDraft>(
    key: K,
    value: PregnancyInfoDraft[K]
  ) => void;

  resetDraft: () => void;

  setServer: (data: PregnancyInfoResponse) => void;
  clearServer: () => void;

  fetchPregnancyInfo: (opts?: {
    force?: boolean;
  }) => Promise<PregnancyInfoResponse | null>;
};

const INITIAL_DRAFT: PregnancyInfoDraft = {
  birthDate: '',
  jobName: '',
  expectedDate: '',
  height: '',
  weightPre: '',
  weightCurrent: '',
  gestationalWeek: '',
  isFirstbirth: null,
  isMultiplePregnancy: null,
  miscarriageHistory: null,
  miscarriageCount: ''
};

export const usePregnancyInfoStore = create<PregnancyInfoStore>()(
  (set, get) => ({
    draft: INITIAL_DRAFT,

    server: null,
    isLoading: false,
    error: null,

    setDraft: (partial) =>
      set((state) => ({ draft: { ...state.draft, ...partial } })),

    setDraftField: (key, value) =>
      set((state) => ({ draft: { ...state.draft, [key]: value } })),

    resetDraft: () => set({ draft: INITIAL_DRAFT }),

    setServer: (data) => set({ server: data }),
    clearServer: () => set({ server: null }),

    fetchPregnancyInfo: async (opts) => {
      const cached = get().server;
      if (cached && !opts?.force) return cached;

      set({ isLoading: true, error: null });
      try {
        const res = await pregnancyInfoApi.getPregnancyInfo();
        set({ server: res, isLoading: false });
        return res;
      } catch (e) {
        set({ isLoading: false, error: e });
        return null;
      }
    }
  })
);
