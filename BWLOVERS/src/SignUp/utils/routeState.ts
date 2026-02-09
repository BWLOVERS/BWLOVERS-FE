import type { SignUpBasicInfoState } from '../types/signupBasicInfo';

export const mergeBasicInfoState = (
  prev: SignUpBasicInfoState | null,
  next: SignUpBasicInfoState
): SignUpBasicInfoState => {
  return {
    ...(prev ?? {}),
    ...next
  };
};
