export type ToggleValue = 'yes' | 'no' | null;

export type SignUpBasicInfoState = {
  birthDate?: string;
  job?: string;
  expectedDate?: string;
  height?: string;
  weightPre?: string;
  weightCurrent?: string;
  gestationalWeek?: string;
  isMultiple?: ToggleValue;
  miscarriageHistory?: ToggleValue;
  isFirstbirth?: ToggleValue;
  miscarriageCount?: string;
};
