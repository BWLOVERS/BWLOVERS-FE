export type ExtraState = {
  cured: 'yes' | 'no' | null;
  lastDate: string;
};

type ValidationArgs = {
  hasExtraInputs: boolean;
  isSecondCategory: boolean;
  noneChecked: boolean;
  selectedDiseases: string[];
  etcText: string;
  extraByDisease: Record<string, ExtraState>;
};

// 선택된 질병들의 추가 입력이 필수 조건을 만족하는지
export function validateSelectedExtras({
  hasExtraInputs,
  isSecondCategory,
  noneChecked,
  selectedDiseases,
  extraByDisease
}: ValidationArgs) {
  if (!hasExtraInputs) return true;
  if (noneChecked) return true; // 해당없음이면 true
  if (selectedDiseases.length === 0) return true;

  return selectedDiseases.every((disease) => {
    const extra = extraByDisease[disease];
    if (!extra) return false;

    // 라디오(예/아니오)는 필수
    if (extra.cured === null) return false;

    // 1번(=isSecondCategory false)만 날짜 8자리 필수
    if (!isSecondCategory) return extra.lastDate.length === 8;

    // 2번은 날짜 없음
    return true;
  });
}

// 폼 전체 완료 판정(핑크 테두리 / 완료 버튼 활성화 기준)
export function computeHealthFormCompleted(args: ValidationArgs) {
  const { noneChecked, selectedDiseases, etcText } = args;

  if (noneChecked) return true;
  if (selectedDiseases.length === 0 && etcText.trim().length === 0)
    return false;

  return validateSelectedExtras(args);
}
