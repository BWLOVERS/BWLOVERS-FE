import type { PregnancyInfoDraft } from '@/stores/pregnancyInfoStore';

function toIsoDate(yyyymmdd: string) {
  if (yyyymmdd.length !== 8) return '';
  const y = yyyymmdd.slice(0, 4);
  const m = yyyymmdd.slice(4, 6);
  const d = yyyymmdd.slice(6, 8);
  return `${y}-${m}-${d}`;
}

function toBool(v: 'yes' | 'no' | null) {
  return v === 'yes';
}

export function mapDraftToPregnancyInfoRequest(draft: PregnancyInfoDraft) {
  const miscarriageHistory =
    draft.miscarriageHistory === 'yes'
      ? Number(draft.miscarriageCount || 0)
      : 0;

  return {
    birthDate: toIsoDate(draft.birthDate),
    height: Number(draft.height),
    weightPre: Number(draft.weightPre),
    weightCurrent: Number(draft.weightCurrent),
    isFirstbirth: toBool(draft.isFirstbirth),
    gestationalWeek: Number(draft.gestationalWeek),
    expectedDate: toIsoDate(draft.expectedDate),
    isMultiplePregnancy: toBool(draft.isMultiplePregnancy),
    miscarriageHistory,
    jobName: draft.jobName
  };
}
