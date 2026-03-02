import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  mapBasicInfoStateToDraft,
  mapResponseToBasicInfoState
} from '@/SignUp/utils/pregnancyInfoMapper';
import { usePregnancyInfoStore } from '@/SignUp/stores/pregnancyInfoStore';
import SingleBtnModal from '@/common/components/SingleBtnModal';
import { pregnancyInfoApi } from '@/apis/users/pregnancyInfoApi';

type JobSelectRouteState = SignUpBasicInfoState & {
  returnTo?: string;
};

export default function EditBasicInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const incomingState = (location.state as JobSelectRouteState | null) ?? null;

  const draftJobName = usePregnancyInfoStore((s) => s.draft.jobName);

  const server = usePregnancyInfoStore((s) => s.server);
  const fetchPregnancyInfo = usePregnancyInfoStore((s) => s.fetchPregnancyInfo);
  const setServer = usePregnancyInfoStore((s) => s.setServer);

  const didInitFormRef = useRef(false);

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

  // route state가 있으면 우선 반영
  useEffect(() => {
    if (!incomingState) return;
    applyStateToForm(incomingState);
  }, [incomingState]);

  //store를 통해 조회
  useEffect(() => {
    fetchPregnancyInfo();
  }, [fetchPregnancyInfo]);

  // server가 준비되면 폼 초기화
  useEffect(() => {
    if (!server) return;
    if (didInitFormRef.current) return;

    didInitFormRef.current = true;

    const mapped = mapResponseToBasicInfoState(server);
    applyStateToForm(mapped);
  }, [server]);

  //JobSelect에서 선택 후 돌아오면 job만 업데이트
  useEffect(() => {
    if (!draftJobName) return;
    setJob(draftJobName);
  }, [draftJobName]);

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

  //PATCH
  const handleSave = async () => {
    setIsSaveClicked(true);
    if (hasError) return;

    try {
      const draftForPatch = mapBasicInfoStateToDraft(currentFormState);
      const updated = await pregnancyInfoApi.patchPregnancyInfo(draftForPatch);

      setServer(updated);

      setIsModalOpen(true);
    } catch (e) {
      if (import.meta.env.DEV) console.log('[PATCH pregnancy-info failed]', e);
    }
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
            placeholder="출산 예정일 8자리 입력 (ex. 20260520)"
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

      <SingleBtnModal
        open={isModalOpen}
        title="수정 완료"
        content="회원 정보가 수정되었습니다."
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
