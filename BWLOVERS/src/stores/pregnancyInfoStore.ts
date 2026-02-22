import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToggleValue = 'yes' | 'no' | null;

export type PregnancyInfoDraft = {
  birthDate: string; // yyyymmdd
  jobName: string; // 세분류 1개
  expectedDate: string; // yyyymmdd
  height: string;
  weightPre: string;
  weightCurrent: string;
  gestationalWeek: string;
  isFirstbirth: ToggleValue;
  isMultiplePregnancy: ToggleValue;
  miscarriageHistory: ToggleValue;
  miscarriageCount: string; // 유산경험 yes일 때만
};

// ✅ 백엔드 명세(이미지 기준): job은 1개
export type PregnancyInfoResponse = {
  infoId: number;
  userId: number;
  birthDate: string; // "YYYY-MM-DD"
  height: number;
  weightPre: number;
  weightCurrent: number;
  isFirstbirth: boolean;
  gestationalWeek: number;
  expectedDate: string; // "YYYY-MM-DD"
  isMultiplePregnancy: boolean;
  miscarriageHistory: number; // 0이면 없음, 1 이상이면 횟수
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
