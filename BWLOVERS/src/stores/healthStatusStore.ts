import { create } from 'zustand';

export type ExtraState = {
  cured: 'yes' | 'no' | null;
  lastDate: string; // "202501"
};

export type HealthFormValue = {
  noneChecked: boolean;
  selected: Record<string, boolean>;
  extraByDisease: Record<string, ExtraState>;
};

// API로 보낼 draft 타입 (함수 없음)
export type HealthStatusDraft = {
  v1: HealthFormValue;
  v2: HealthFormValue;
  v3: HealthFormValue;
};

// store 상태 타입(함수 포함)
export type HealthStatusState = HealthStatusDraft & {
  setVariantValue: (variant: 1 | 2 | 3, value: HealthFormValue) => void;
  resetAll: () => void;
};

// 참조 공유 방지
const createEmptyValue = (): HealthFormValue => ({
  noneChecked: false,
  selected: {},
  extraByDisease: {}
});

export const useHealthStatusStore = create<HealthStatusState>((set) => ({
  v1: createEmptyValue(),
  v2: createEmptyValue(),
  v3: createEmptyValue(),

  setVariantValue: (variant, value) =>
    set((prev) => ({
      ...prev,
      ...(variant === 1 ? { v1: value } : {}),
      ...(variant === 2 ? { v2: value } : {}),
      ...(variant === 3 ? { v3: value } : {})
    })),

  resetAll: () =>
    set({
      v1: createEmptyValue(),
      v2: createEmptyValue(),
      v3: createEmptyValue()
    })
}));
