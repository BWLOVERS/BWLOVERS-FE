import { create } from 'zustand';

export type ExtraState = {
  cured: 'yes' | 'no' | null;
  lastDate: string;
};

export type HealthFormValue = {
  noneChecked: boolean;
  selected: Record<string, boolean>;
  extraByDisease: Record<string, ExtraState>;
};

export type HealthStatusDraft = {
  v1: HealthFormValue;
  v2: HealthFormValue;
  v3: HealthFormValue;
};

export type HealthStatusState = HealthStatusDraft & {
  hasLoaded: boolean;
  setVariantValue: (variant: 1 | 2 | 3, value: HealthFormValue) => void;
  setAll: (draft: HealthStatusDraft) => void;
  resetAll: () => void;
};

const createEmptyValue = (): HealthFormValue => ({
  noneChecked: false,
  selected: {},
  extraByDisease: {}
});

export const useHealthStatusStore = create<HealthStatusState>((set) => ({
  v1: createEmptyValue(),
  v2: createEmptyValue(),
  v3: createEmptyValue(),
  hasLoaded: false,

  setVariantValue: (variant, value) =>
    set((prev) => ({
      ...prev,
      ...(variant === 1 ? { v1: value } : {}),
      ...(variant === 2 ? { v2: value } : {}),
      ...(variant === 3 ? { v3: value } : {})
    })),

  setAll: (draft) =>
    set({
      v1: draft.v1,
      v2: draft.v2,
      v3: draft.v3,
      hasLoaded: true
    }),

  resetAll: () =>
    set({
      v1: createEmptyValue(),
      v2: createEmptyValue(),
      v3: createEmptyValue(),
      hasLoaded: false
    })
}));
