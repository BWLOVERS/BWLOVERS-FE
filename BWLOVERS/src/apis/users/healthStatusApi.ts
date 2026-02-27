import { axiosInstance } from '@/apis/axiosInstance';
import type { HealthStatusDraft } from '@/stores/healthStatusStore';

// =======================
// 1) 서버 enum 타입 (권장: 오타 방지)
// =======================
type PastDiseaseType =
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
type ChronicDiseaseType =
  | 'HYPERTENSION'
  | 'DIABETES'
  | 'ASTHMA'
  | 'LUPUS'
  | 'RHEUMATOID_ARTHRITIS'
  | 'NONE';
type PregnancyComplicationType =
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

// =======================
// 2) 한글 라벨 -> enum 매핑표 (✅ ETC/기타 삭제)
// =======================
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

// =======================
// 3) Request 타입
// =======================
type PastDiseaseItem = {
  pastDiseaseType: PastDiseaseType;
  pastCured: boolean;
  pastLastTreatedAt: string; // 항상 보냄
};

type ChronicDiseaseItem = {
  chronicDiseaseType: ChronicDiseaseType;
  chronicOnMedication: boolean; // 항상 보냄
};

export type HealthStatusRequest = {
  pastDiseases: PastDiseaseItem[];
  chronicDiseases: ChronicDiseaseItem[];
  pregnancyComplications: PregnancyComplicationType[];
};

function getSelectedLabels(selected: Record<string, boolean>) {
  return Object.keys(selected).filter((k) => selected[k]);
}

// "202501" -> "2025-01"
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

export function mapDraftToHealthStatusRequest(
  draft: HealthStatusDraft
): HealthStatusRequest {
  const pastDiseases: HealthStatusRequest['pastDiseases'] = [];
  const chronicDiseases: HealthStatusRequest['chronicDiseases'] = [];
  const pregnancyComplications: HealthStatusRequest['pregnancyComplications'] =
    [];

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

export const healthStatusApi = {
  async postHealthStatus(draft: HealthStatusDraft) {
    const body = mapDraftToHealthStatusRequest(draft);

    if (import.meta.env.DEV) {
      console.log('[HEALTH STATUS] request body =', body);
    }

    const { data } = await axiosInstance.post('/users/me/health-status', body);

    if (import.meta.env.DEV) {
      console.log('[HEALTH STATUS] success response =', data);
    }

    return data;
  }
};
