import type {
  PregnancyInfoDraft,
  ToggleValue
} from '@/stores/pregnancyInfoStore';
import type { SignUpBasicInfoState } from '@/SignUp/types/signupBasicInfo';
import { isDate8 } from './inputUtils';

type BasicInfoErrors = {
  birthDate: boolean;
  expectedDate: boolean;
  job: boolean;
  height: boolean;
  weightPre: boolean;
  weightCurrent: boolean;
  gestationalWeek: boolean;
  isMultiple: boolean;
  miscarriageHistory: boolean;
  isFirstbirth: boolean;
  miscarriageCount: boolean;
};

const isEmpty = (v?: string) => (v ?? '').trim().length === 0;

/** ✅ (1) Signup(zustand draft)에서 쓰는 validation */
export const getBasicInfoValidationFromDraft = (draft: PregnancyInfoDraft) => {
  const errors: BasicInfoErrors = {
    birthDate: !isDate8(draft.birthDate),
    expectedDate: !isDate8(draft.expectedDate),
    job: isEmpty(draft.jobName),
    height: isEmpty(draft.height),
    weightPre: isEmpty(draft.weightPre),
    weightCurrent: isEmpty(draft.weightCurrent),
    gestationalWeek: isEmpty(draft.gestationalWeek),
    isMultiple: draft.isMultiplePregnancy === null,
    miscarriageHistory: draft.miscarriageHistory === null,
    isFirstbirth: draft.isFirstbirth === null,
    miscarriageCount:
      draft.miscarriageHistory === 'yes' && isEmpty(draft.miscarriageCount)
  };

  const hasError = Object.values(errors).some(Boolean);

  const isMiscarriageCountRequired = draft.miscarriageHistory === 'yes';
  const isAllRequiredFilled =
    !isEmpty(draft.birthDate) &&
    !isEmpty(draft.jobName) &&
    !isEmpty(draft.expectedDate) &&
    !isEmpty(draft.height) &&
    !isEmpty(draft.weightPre) &&
    !isEmpty(draft.weightCurrent) &&
    !isEmpty(draft.gestationalWeek) &&
    draft.isMultiplePregnancy !== null &&
    draft.miscarriageHistory !== null &&
    draft.isFirstbirth !== null &&
    (!isMiscarriageCountRequired || !isEmpty(draft.miscarriageCount));

  return { errors, hasError, isAllRequiredFilled };
};

/** ✅ (2) EditBasicInfo(로컬 state / route state)에서 쓰는 validation */
export const getBasicInfoValidation = (state: SignUpBasicInfoState) => {
  const birthDate = state.birthDate ?? '';
  const expectedDate = state.expectedDate ?? '';
  const jobName = state.jobName ?? '';
  const height = state.height ?? '';
  const weightPre = state.weightPre ?? '';
  const weightCurrent = state.weightCurrent ?? '';
  const gestationalWeek = state.gestationalWeek ?? '';
  const miscarriageCount = state.miscarriageCount ?? '';

  const isMultiplePregnancy: ToggleValue = state.isMultiplePregnancy ?? null;
  const miscarriageHistory: ToggleValue = state.miscarriageHistory ?? null;
  const isFirstbirth: ToggleValue = state.isFirstbirth ?? null;

  const errors: BasicInfoErrors = {
    birthDate: !isDate8(birthDate),
    expectedDate: !isDate8(expectedDate),
    job: isEmpty(jobName),
    height: isEmpty(height),
    weightPre: isEmpty(weightPre),
    weightCurrent: isEmpty(weightCurrent),
    gestationalWeek: isEmpty(gestationalWeek),
    isMultiple: isMultiplePregnancy === null,
    miscarriageHistory: miscarriageHistory === null,
    isFirstbirth: isFirstbirth === null,
    miscarriageCount: miscarriageHistory === 'yes' && isEmpty(miscarriageCount)
  };

  const hasError = Object.values(errors).some(Boolean);

  const isMiscarriageCountRequired = miscarriageHistory === 'yes';
  const isAllRequiredFilled =
    !isEmpty(birthDate) &&
    !isEmpty(jobName) &&
    !isEmpty(expectedDate) &&
    !isEmpty(height) &&
    !isEmpty(weightPre) &&
    !isEmpty(weightCurrent) &&
    !isEmpty(gestationalWeek) &&
    isMultiplePregnancy !== null &&
    miscarriageHistory !== null &&
    isFirstbirth !== null &&
    (!isMiscarriageCountRequired || !isEmpty(miscarriageCount));

  return { errors, hasError, isAllRequiredFilled };
};
