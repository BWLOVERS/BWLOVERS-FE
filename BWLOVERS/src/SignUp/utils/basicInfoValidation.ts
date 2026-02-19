import type { PregnancyInfoDraft } from '@/stores/pregnancyInfoStore';
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

export const getBasicInfoValidation = (draft: PregnancyInfoDraft) => {
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
