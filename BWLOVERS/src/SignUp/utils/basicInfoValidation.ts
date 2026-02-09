import type {
  SignUpBasicInfoState,
  ToggleValue
} from '../types/signupBasicInfo';
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

export const getBasicInfoValidation = (state: SignUpBasicInfoState) => {
  const birthDate = state.birthDate ?? '';
  const expectedDate = state.expectedDate ?? '';
  const job = state.job ?? '';
  const height = state.height ?? '';
  const weightPre = state.weightPre ?? '';
  const weightCurrent = state.weightCurrent ?? '';
  const gestationalWeek = state.gestationalWeek ?? '';
  const miscarriageCount = state.miscarriageCount ?? '';

  const isMultiple: ToggleValue = state.isMultiple ?? null;
  const miscarriageHistory: ToggleValue = state.miscarriageHistory ?? null;
  const isFirstbirth: ToggleValue = state.isFirstbirth ?? null;

  // 에러 기준
  // - 날짜: 8자리 날짜 형식이 아니면 에러
  // - 나머지: 비어있으면 에러
  // - 토글: null이면 에러
  // - 유산 횟수: 유산 경험이 yes일 때 비어있으면 에러
  const errors: BasicInfoErrors = {
    birthDate: !isDate8(birthDate),
    expectedDate: !isDate8(expectedDate),
    job: isEmpty(job),
    height: isEmpty(height),
    weightPre: isEmpty(weightPre),
    weightCurrent: isEmpty(weightCurrent),
    gestationalWeek: isEmpty(gestationalWeek),
    isMultiple: isMultiple === null,
    miscarriageHistory: miscarriageHistory === null,
    isFirstbirth: isFirstbirth === null,
    miscarriageCount: miscarriageHistory === 'yes' && isEmpty(miscarriageCount)
  };

  // 위 에러 하나 이상 있는지
  const hasError = Object.values(errors).some(Boolean);

  // 버튼 enabled: 빈 항목 없는지 체크
  const isMiscarriageCountRequired = miscarriageHistory === 'yes';
  const isAllRequiredFilled =
    !isEmpty(birthDate) &&
    !isEmpty(job) &&
    !isEmpty(expectedDate) &&
    !isEmpty(height) &&
    !isEmpty(weightPre) &&
    !isEmpty(weightCurrent) &&
    !isEmpty(gestationalWeek) &&
    isMultiple !== null &&
    miscarriageHistory !== null &&
    isFirstbirth !== null &&
    (!isMiscarriageCountRequired || !isEmpty(miscarriageCount));

  return { errors, hasError, isAllRequiredFilled };
};
