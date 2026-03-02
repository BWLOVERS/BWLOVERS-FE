import { axiosInstance } from '@/apis/axiosInstance';
import type { HealthStatusDraft } from '@/SignUp/stores/healthStatusStore';

//서버 enum 타입
export type PastDiseaseType =
  | 'UTERINE_FIBROID'
  | 'ENDOMETRIOSIS'
  | 'OVARIAN_CYST'
  | 'HYPERTENSION'
  | 'DIABETES'
  | 'THYROID_DISEASE'
  | 'ABDOMINAL_SURGERY'
  | 'OTHER_SURGERY'
  | 'DEPRESSION'
  | 'ANXIETY_DISORDER'
  | 'NONE';

export type ChronicDiseaseType =
  | 'HYPERTENSION'
  | 'DIABETES'
  | 'ASTHMA'
  | 'LUPUS'
  | 'RHEUMATOID_ARTHRITIS'
  | 'NONE';

export type PregnancyComplicationType =
  | 'GESTATIONAL_DIABETES'
  | 'GESTATIONAL_HYPERTENSION'
  | 'PREECLAMPSIA'
  | 'PRETERM_LABOR'
  | 'PRETERM_RISK'
  | 'PLACENTA_PREVIA'
  | 'AMNIOTIC_FLUID_DISORDER'
  | 'FETAL_GROWTH_RESTRICTION'
  | 'CONGENITAL_ANOMALY'
  | 'NONE';

// 한글 라벨 -> enum 매핑
const PAST_DISEASE_MAP: Record<string, Exclude<PastDiseaseType, 'NONE'>> = {
  자궁근종: 'UTERINE_FIBROID',
  자궁내막증: 'ENDOMETRIOSIS',
  난소낭종: 'OVARIAN_CYST',

  고혈압: 'HYPERTENSION',
  당뇨: 'DIABETES',
  '갑상선 질환': 'THYROID_DISEASE',

  '복부 수술': 'ABDOMINAL_SURGERY',
  '기타 수술': 'OTHER_SURGERY',

  우울증: 'DEPRESSION',
  불안장애: 'ANXIETY_DISORDER'
};

const CHRONIC_DISEASE_MAP: Record<
  string,
  Exclude<ChronicDiseaseType, 'NONE'>
> = {
  고혈압: 'HYPERTENSION',
  당뇨: 'DIABETES',
  천식: 'ASTHMA',
  루푸스: 'LUPUS',
  류마티스: 'RHEUMATOID_ARTHRITIS'
};

const PREGNANCY_COMPLICATION_MAP: Record<
  string,
  Exclude<PregnancyComplicationType, 'NONE'>
> = {
  '임신성 당뇨': 'GESTATIONAL_DIABETES',
  '임신성 고혈압': 'GESTATIONAL_HYPERTENSION',
  임신중독증: 'PREECLAMPSIA',

  조기진통: 'PRETERM_LABOR',
  '조산 위험': 'PRETERM_RISK',

  전치태반: 'PLACENTA_PREVIA',
  '양수 과다/과소': 'AMNIOTIC_FLUID_DISORDER',

  '태아 성장 지연': 'FETAL_GROWTH_RESTRICTION',
  '선천적 이상 소견': 'CONGENITAL_ANOMALY'
};

// Request 타입
type PastDiseaseItem = {
  pastDiseaseType: PastDiseaseType;
  pastCured: boolean;
  pastLastTreatedAt: string;
};

type ChronicDiseaseItem = {
  chronicDiseaseType: ChronicDiseaseType;
  chronicOnMedication: boolean;
};

export type HealthStatusRequest = {
  pastDiseases: PastDiseaseItem[];
  chronicDiseases: ChronicDiseaseItem[];
  pregnancyComplications: PregnancyComplicationType[];
};

// Response 타입
export type HealthStatusResponse = {
  statusId: number;
  userId: number;
  createdAt: string;

  pastDiseases: Array<{
    pastId: number;
    pastDiseaseType: PastDiseaseType;
    pastCured: boolean;
    pastLastTreatedYm: string;
  }>;

  chronicDiseases: Array<{
    chronicId: number;
    chronicDiseaseType: ChronicDiseaseType;
    chronicOnMedication: boolean;
  }>;

  pregnancyComplications: Array<{
    complicationId: number;
    pregnancyComplicationType: PregnancyComplicationType;
  }>;
};

function getSelectedLabels(selected: Record<string, boolean>) {
  return Object.keys(selected).filter((k) => selected[k]);
}

// 날짜 형식 변환(-포함)
function yyyymmToYm(value: string) {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length !== 6) return '';

  const yyyy = digits.slice(0, 4);
  const mm = digits.slice(4, 6);

  const monthNum = Number(mm);
  if (Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12) return '';

  return `${yyyy}-${mm}`;
}

function assertMapped<T>(mapped: T | undefined, label: string): T {
  if (!mapped) {
    throw new Error(`[healthStatusApi] 매핑되지 않은 라벨: "${label}"`);
  }
  return mapped;
}

//Draft -> Request (POST/PUT)
export function mapDraftToHealthStatusRequest(
  draft: HealthStatusDraft
): HealthStatusRequest {
  const pastDiseases: HealthStatusRequest['pastDiseases'] = [];
  const chronicDiseases: HealthStatusRequest['chronicDiseases'] = [];
  const pregnancyComplications: HealthStatusRequest['pregnancyComplications'] =
    [];

  // v1
  if (draft.v1.noneChecked) {
    pastDiseases.push({
      pastDiseaseType: 'NONE',
      pastCured: false,
      pastLastTreatedAt: '9999-01'
    });
  } else {
    const labels = getSelectedLabels(draft.v1.selected);
    labels.forEach((label) => {
      const extra = draft.v1.extraByDisease[label];
      const ym = yyyymmToYm(extra?.lastDate ?? '') || '9999-01';

      const enumValue = assertMapped(PAST_DISEASE_MAP[label], label);

      pastDiseases.push({
        pastDiseaseType: enumValue,
        pastCured: extra?.cured === 'yes',
        pastLastTreatedAt: ym
      });
    });
  }

  // v2
  if (draft.v2.noneChecked) {
    chronicDiseases.push({
      chronicDiseaseType: 'NONE',
      chronicOnMedication: false
    });
  } else {
    const labels = getSelectedLabels(draft.v2.selected);
    labels.forEach((label) => {
      const extra = draft.v2.extraByDisease[label];
      const enumValue = assertMapped(CHRONIC_DISEASE_MAP[label], label);

      chronicDiseases.push({
        chronicDiseaseType: enumValue,
        chronicOnMedication: extra?.cured === 'yes'
      });
    });
  }

  // v3
  if (draft.v3.noneChecked) {
    pregnancyComplications.push('NONE');
  } else {
    const labels = getSelectedLabels(draft.v3.selected);
    labels.forEach((label) => {
      const enumValue = assertMapped(PREGNANCY_COMPLICATION_MAP[label], label);
      pregnancyComplications.push(enumValue);
    });
  }

  return { pastDiseases, chronicDiseases, pregnancyComplications };
}

//Response -> Draft
function invertMap<T extends string>(map: Record<string, T>) {
  const inverted = {} as Record<T, string>;
  Object.entries(map).forEach(([label, code]) => {
    inverted[code] = label;
  });
  return inverted;
}

const PAST_LABEL_BY_ENUM = invertMap(PAST_DISEASE_MAP);
const CHRONIC_LABEL_BY_ENUM = invertMap(CHRONIC_DISEASE_MAP);
const PREG_LABEL_BY_ENUM = invertMap(PREGNANCY_COMPLICATION_MAP);

function ymToYYYYMM(ym: string) {
  return (ym ?? '').replace(/\D/g, '').slice(0, 6);
}

function createEmptyValue(): HealthStatusDraft['v1'] {
  return { noneChecked: false, selected: {}, extraByDisease: {} };
}

export function mapHealthStatusResponseToDraft(
  res: HealthStatusResponse | null
): HealthStatusDraft {
  const base: HealthStatusDraft = {
    v1: createEmptyValue(),
    v2: createEmptyValue(),
    v3: createEmptyValue()
  };

  if (!res) return base;

  // v1
  const past = res.pastDiseases ?? [];
  if (past.length === 0 || past.every((d) => d.pastDiseaseType === 'NONE')) {
    base.v1.noneChecked = true;
  } else {
    past.forEach((d) => {
      if (d.pastDiseaseType === 'NONE') return;

      const label = (
        PAST_LABEL_BY_ENUM as Partial<Record<PastDiseaseType, string>>
      )[d.pastDiseaseType];
      if (!label) return;

      base.v1.selected[label] = true;
      base.v1.extraByDisease[label] = {
        cured: d.pastCured ? 'yes' : 'no',
        lastDate: d.pastLastTreatedYm ? ymToYYYYMM(d.pastLastTreatedYm) : ''
      };
    });
  }

  // v2
  const chronic = res.chronicDiseases ?? [];
  if (
    chronic.length === 0 ||
    chronic.every((d) => d.chronicDiseaseType === 'NONE')
  ) {
    base.v2.noneChecked = true;
  } else {
    chronic.forEach((d) => {
      if (d.chronicDiseaseType === 'NONE') return;

      const label = (
        CHRONIC_LABEL_BY_ENUM as Partial<Record<ChronicDiseaseType, string>>
      )[d.chronicDiseaseType];
      if (!label) return;

      base.v2.selected[label] = true;
      base.v2.extraByDisease[label] = {
        cured: d.chronicOnMedication ? 'yes' : 'no',
        lastDate: ''
      };
    });
  }

  // v3
  const preg = res.pregnancyComplications ?? [];
  if (
    preg.length === 0 ||
    preg.every((d) => d.pregnancyComplicationType === 'NONE')
  ) {
    base.v3.noneChecked = true;
  } else {
    preg.forEach((d) => {
      if (d.pregnancyComplicationType === 'NONE') return;

      const label = (
        PREG_LABEL_BY_ENUM as Partial<Record<PregnancyComplicationType, string>>
      )[d.pregnancyComplicationType];
      if (!label) return;

      base.v3.selected[label] = true;
    });
  }

  return base;
}

//API
export const healthStatusApi = {
  async postHealthStatus(draft: HealthStatusDraft) {
    const body = mapDraftToHealthStatusRequest(draft);
    const { data } = await axiosInstance.post('/users/me/health-status', body);
    return data;
  },

  async getHealthStatus() {
    const { data } = await axiosInstance.get<HealthStatusResponse>(
      '/users/me/health-status'
    );
    return data;
  },

  async getHealthStatusDraft() {
    const res = await this.getHealthStatus();
    return mapHealthStatusResponseToDraft(res);
  },

  // patch: draft 보내고, 응답(res)을 draft로 변환해서 바로 돌려줌 (GET 추가 호출 없음)
  async patchHealthStatusDraft(draft: HealthStatusDraft) {
    const body = mapDraftToHealthStatusRequest(draft);

    const { data } = await axiosInstance.patch<HealthStatusResponse>(
      '/users/me/health-status',
      body
    );

    return mapHealthStatusResponseToDraft(data);
  }
};
