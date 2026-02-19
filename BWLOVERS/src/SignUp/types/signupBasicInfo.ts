export type ToggleValue = 'yes' | 'no' | null;

export type SignUpBasicInfoState = {
  birthDate?: string;
  jobName?: string; // ✅ job -> jobName
  expectedDate?: string;
  height?: string;
  weightPre?: string;
  weightCurrent?: string;
  gestationalWeek?: string;
  isMultiplePregnancy?: ToggleValue; // ✅ isMultiple -> isMultiplePregnancy
  miscarriageHistory?: ToggleValue;
  isFirstbirth?: ToggleValue;
  miscarriageCount?: string;
};
