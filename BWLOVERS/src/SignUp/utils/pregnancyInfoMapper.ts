import type {
  PregnancyInfoDraft,
  ToggleValue,
  PregnancyInfoResponse
} from '@/SignUp/stores/pregnancyInfoStore';
import type { SignUpBasicInfoState } from '@/SignUp/types/signupBasicInfo';

function toIsoDate(yyyymmdd: string) {
  if (yyyymmdd.length !== 8) return '';
  const y = yyyymmdd.slice(0, 4);
  const m = yyyymmdd.slice(4, 6);
  const d = yyyymmdd.slice(6, 8);
  return `${y}-${m}-${d}`;
}

function isoTo8(iso: string) {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return '';
  const [y, m, d] = parts;
  if (!y || !m || !d) return '';
  return `${y}${m}${d}`;
}

function toBool(v: ToggleValue) {
  return v === 'yes';
}

function boolToToggle(v: boolean): ToggleValue {
  return v ? 'yes' : 'no';
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

export function mapResponseToBasicInfoState(
  res: PregnancyInfoResponse
): SignUpBasicInfoState {
  const resolvedJobName = res.job?.jobName ?? '';

  return {
    birthDate: isoTo8(res.birthDate),
    expectedDate: isoTo8(res.expectedDate),
    jobName: resolvedJobName,
    height: String(res.height ?? ''),
    weightPre: String(res.weightPre ?? ''),
    weightCurrent: String(res.weightCurrent ?? ''),
    gestationalWeek: String(res.gestationalWeek ?? ''),
    isFirstbirth: boolToToggle(Boolean(res.isFirstbirth)),
    isMultiplePregnancy: boolToToggle(Boolean(res.isMultiplePregnancy)),
    miscarriageHistory: res.miscarriageHistory > 0 ? 'yes' : 'no',
    miscarriageCount:
      res.miscarriageHistory > 0 ? String(res.miscarriageHistory) : ''
  };
}

export function mapBasicInfoStateToDraft(
  state: SignUpBasicInfoState
): PregnancyInfoDraft {
  return {
    birthDate: state.birthDate ?? '',
    jobName: state.jobName ?? '',
    expectedDate: state.expectedDate ?? '',
    height: state.height ?? '',
    weightPre: state.weightPre ?? '',
    weightCurrent: state.weightCurrent ?? '',
    gestationalWeek: state.gestationalWeek ?? '',
    isFirstbirth: state.isFirstbirth ?? null,
    isMultiplePregnancy: state.isMultiplePregnancy ?? null,
    miscarriageHistory: state.miscarriageHistory ?? null,
    miscarriageCount: state.miscarriageCount ?? ''
  };
}
