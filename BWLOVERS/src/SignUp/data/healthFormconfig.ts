export type HealthVariant = 1 | 2 | 3;

export type DiseaseGroup = {
  title: string;
  diseases: string[];
};

export type HealthFormConfig = Record<
  HealthVariant,
  {
    groups: DiseaseGroup[];
    hasExtraInputs: boolean;
    isSecondCategory: boolean;
  }
>;

export const FORM_CONFIG: HealthFormConfig = {
  1: {
    groups: [
      {
        title: '산부인과 질환',
        diseases: ['자궁근종', '자궁내막증', '난소낭종']
      },
      { title: '내과 질환', diseases: ['고혈압', '당뇨', '갑상선 질환'] },
      { title: '수술·입원 이력', diseases: ['복부 수술', '기타 수술'] },
      { title: '정신건강 관련', diseases: ['우울증', '불안장애'] }
    ],
    hasExtraInputs: true,
    isSecondCategory: false
  },
  2: {
    groups: [
      { title: '혈압·혈당 관리 질환', diseases: ['고혈압', '당뇨'] },
      { title: '호흡기 질환', diseases: ['천식'] },
      { title: '면역·자가면역 질환', diseases: ['루푸스', '류마티스'] }
    ],
    hasExtraInputs: true,
    isSecondCategory: true
  },
  3: {
    groups: [
      {
        title: '임신성 질환',
        diseases: ['임신성 당뇨', '임신성 고혈압', '임신중독증']
      },
      { title: '조산·위험 임신', diseases: ['조기진통', '조산 위험'] },
      { title: '태반·양수 이상', diseases: ['전치태반', '양수과다 / 과소'] },
      {
        title: '태아 관련 소견',
        diseases: ['태아 성장 지연', '선천적 이상 소견']
      }
    ],
    hasExtraInputs: false,
    isSecondCategory: false
  }
};
