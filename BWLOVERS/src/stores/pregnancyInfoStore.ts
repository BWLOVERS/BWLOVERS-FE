import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  setDraft: (partial: Partial<PregnancyInfoDraft>) => void;

  // ✅ 추가: key/value로 안전하게 업데이트
  setDraftField: <K extends keyof PregnancyInfoDraft>(
    key: K,
    value: PregnancyInfoDraft[K]
  ) => void;

  resetDraft: () => void;

  setServer: (data: PregnancyInfoResponse) => void;
  clearServer: () => void;
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
  persist(
    (set) => ({
      draft: INITIAL_DRAFT,
      server: null,

      setDraft: (partial) =>
        set((state) => ({ draft: { ...state.draft, ...partial } })),

      setDraftField: (key, value) =>
        set((state) => ({ draft: { ...state.draft, [key]: value } })),

      resetDraft: () => set({ draft: INITIAL_DRAFT }),

      setServer: (data) => set({ server: data }),
      clearServer: () => set({ server: null })
    }),
    { name: 'pregnancy-info-store' }
  )
);
