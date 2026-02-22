import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ActionButton from '@/common/components/ActionButton';
import LabeledInput from '@/SignUp/components/LabeledInput';
import NumberInput from '@/SignUp/components/NumberInput';
import JobInput from '@/SignUp/components/JobInput';
import ToggleInput from '@/SignUp/components/ToggleInput';

import type {
  SignUpBasicInfoState,
  ToggleValue
} from '@/SignUp/types/signupBasicInfo';
import { onlyDigits, sliceTo8Digits } from '@/SignUp/utils/inputUtils';
import { mergeBasicInfoState } from '@/SignUp/utils/routeState';
import { getBasicInfoValidation } from '@/SignUp/utils/basicInfoValidation';
import { pregnancyInfoApi } from '@/apis/users/pregnancyInfoApi';
import { mapResponseToBasicInfoState } from '@/SignUp/utils/pregnancyInfoMapper';
import { usePregnancyInfoStore } from '@/stores/pregnancyInfoStore';

type JobSelectRouteState = SignUpBasicInfoState & {
  returnTo?: string;
};

export default function EditBasicInfo() {
  const navigate = useNavigate();
  const location = useLocation();

  const incomingState = (location.state as JobSelectRouteState | null) ?? null;

  // ✅ JobSelect는 zustand draft를 바꾸는 구조라서 구독
  const draftJobName = usePregnancyInfoStore((s) => s.draft.jobName);

  const [birthDate, setBirthDate] = useState('');
  const [job, setJob] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [height, setHeight] = useState('');
  const [weightPre, setWeightPre] = useState('');
  const [weightCurrent, setWeightCurrent] = useState('');
  const [gestationalWeek, setGestationalWeek] = useState('');
  const [miscarriageCount, setMiscarriageCount] = useState('');
  const [isMultiple, setIsMultiple] = useState<ToggleValue>(null);
  const [miscarriageHistory, setMiscarriageHistory] =
    useState<ToggleValue>(null);
  const [isFirstbirth, setIsFirstbirth] = useState<ToggleValue>(null);

  const [isSaveClicked, setIsSaveClicked] = useState(false);

  // ✅ 공통: state를 폼에 반영하는 함수
  const applyStateToForm = (state: SignUpBasicInfoState) => {
    if (typeof state.birthDate === 'string') setBirthDate(state.birthDate);
    if (typeof state.jobName === 'string') setJob(state.jobName);
    if (typeof state.expectedDate === 'string')
      setExpectedDate(state.expectedDate);
    if (typeof state.height === 'string') setHeight(state.height);
    if (typeof state.weightPre === 'string') setWeightPre(state.weightPre);
    if (typeof state.weightCurrent === 'string')
      setWeightCurrent(state.weightCurrent);
    if (typeof state.gestationalWeek === 'string')
      setGestationalWeek(state.gestationalWeek);

    if (typeof state.isMultiplePregnancy !== 'undefined')
      setIsMultiple(state.isMultiplePregnancy ?? null);
    if (typeof state.miscarriageHistory !== 'undefined')
      setMiscarriageHistory(state.miscarriageHistory ?? null);
    if (typeof state.isFirstbirth !== 'undefined')
      setIsFirstbirth(state.isFirstbirth ?? null);

    if (typeof state.miscarriageCount === 'string')
      setMiscarriageCount(state.miscarriageCount);
  };

  // ✅ (1) 탭 진입 시: 서버 조회해서 폼 자동 입력
  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        const res = await pregnancyInfoApi.getPregnancyInfo();
        if (!alive) return;

        const mapped = mapResponseToBasicInfoState(res);
        applyStateToForm(mapped);

        // ✅ 혹시 draft.jobName이 비어있으면(처음) job input에 서버값이 들어가게 됨
        // (zustand draft는 여기서 굳이 건드릴 필요 없음)
      } catch (e) {
        if (import.meta.env.DEV) console.log('[GET pregnancy-info failed]', e);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, []);

  // ✅ (2) JobSelect에서 선택 후 돌아오면 zustand draft.jobName이 바뀜 → job input 업데이트
  useEffect(() => {
    if (!draftJobName) return;
    setJob(draftJobName);
  }, [draftJobName]);

  // ✅ (3) 기존처럼 route state로 들어온 값이 있으면 우선 반영 (옵션)
  // - 만약 EditBasicInfo에서 route state를 안 쓰기로 했다면 이 블록 삭제해도 됨
  useEffect(() => {
    if (!incomingState) return;
    applyStateToForm(incomingState);
  }, [incomingState]);

  const handleDateChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (value: string) => {
      setter(sliceTo8Digits(value));
    };

  const handleNumberChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (value: string) => {
      setter(onlyDigits(value));
    };

  const currentFormState: SignUpBasicInfoState = useMemo(
    () => ({
      birthDate,
      jobName: job,
      expectedDate,
      height,
      weightPre,
      weightCurrent,
      gestationalWeek,
      isMultiplePregnancy: isMultiple,
      miscarriageHistory,
      isFirstbirth,
      miscarriageCount
    }),
    [
      birthDate,
      job,
      expectedDate,
      height,
      weightPre,
      weightCurrent,
      gestationalWeek,
      isMultiple,
      miscarriageHistory,
      isFirstbirth,
      miscarriageCount
    ]
  );

  const { errors, hasError, isAllRequiredFilled } = useMemo(
    () => getBasicInfoValidation(currentFormState),
    [currentFormState]
  );

  const handleJobSearch = () => {
    navigate('/jobs', {
      state: {
        ...mergeBasicInfoState(incomingState, currentFormState),
        returnTo: '/profile/edit?tab=info'
      }
    });
  };

  const handleSave = () => {
    setIsSaveClicked(true);
    if (hasError) return;

    // ✅ 나중에 PATCH API 연결할 payload
    console.log('EDIT BASIC INFO SAVE PAYLOAD:', currentFormState);
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-15 flex w-73.25 flex-col gap-5">
          <LabeledInput
            label="생년월일"
            placeholder="생년월일 8자리 입력 (ex. 19950101)"
            value={birthDate}
            onChange={handleDateChange(setBirthDate)}
            inError={isSaveClicked && errors.birthDate}
            type="tel"
          />

          <JobInput
            value={job}
            onSearch={handleJobSearch}
            inError={isSaveClicked && errors.job}
          />

          <NumberInput
            label="키"
            unit="cm"
            value={height}
            onChange={handleNumberChange(setHeight)}
            inError={isSaveClicked && errors.height}
          />

          <NumberInput
            label="임신 전 몸무게"
            unit="kg"
            value={weightPre}
            onChange={handleNumberChange(setWeightPre)}
            inError={isSaveClicked && errors.weightPre}
          />

          <NumberInput
            label="임신 후(현재) 몸무게"
            unit="kg"
            value={weightCurrent}
            onChange={handleNumberChange(setWeightCurrent)}
            inError={isSaveClicked && errors.weightCurrent}
          />

          <NumberInput
            label="임신 주차"
            unit="주차"
            value={gestationalWeek}
            onChange={handleNumberChange(setGestationalWeek)}
            inError={isSaveClicked && errors.gestationalWeek}
          />

          <LabeledInput
            label="출산 예정일"
            placeholder="출산 예정일 8자리 입력 (ex. 19950101)"
            type="tel"
            value={expectedDate}
            onChange={handleDateChange(setExpectedDate)}
            inError={isSaveClicked && errors.expectedDate}
          />

          <ToggleInput
            label="초산 여부"
            leftLabel="예"
            rightLabel="아니오"
            value={isFirstbirth}
            onChange={setIsFirstbirth}
          />

          <ToggleInput
            label="다태아(쌍둥이 여부)"
            leftLabel="예"
            rightLabel="아니오"
            value={isMultiple}
            onChange={setIsMultiple}
          />

          <ToggleInput
            label="유산 경험"
            leftLabel="있음"
            rightLabel="없음"
            value={miscarriageHistory}
            onChange={(v) => {
              setMiscarriageHistory(v);
              if (v === 'no') setMiscarriageCount('');
            }}
          />

          {miscarriageHistory === 'yes' && (
            <NumberInput
              label="유산 횟수"
              unit="회"
              value={miscarriageCount}
              onChange={handleNumberChange(setMiscarriageCount)}
              inError={isSaveClicked && errors.miscarriageCount}
            />
          )}
        </div>
      </div>

      <div className="flex w-full justify-end px-11.5 pb-9.75">
        <ActionButton
          label="수정"
          variant="primary"
          onClick={handleSave}
          disabled={!isAllRequiredFilled}
        />
      </div>
    </>
  );
}
