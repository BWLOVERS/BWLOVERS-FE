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

export default function EditBasicInfo() {
  const navigate = useNavigate();
  const location = useLocation();

  const incomingState = (location.state as SignUpBasicInfoState | null) ?? null;

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

  useEffect(() => {
    if (!incomingState) return;

    if (typeof incomingState.birthDate === 'string')
      setBirthDate(incomingState.birthDate);
    if (typeof incomingState.jobName === 'string')
      setJob(incomingState.jobName);
    if (typeof incomingState.expectedDate === 'string')
      setExpectedDate(incomingState.expectedDate);
    if (typeof incomingState.height === 'string')
      setHeight(incomingState.height);
    if (typeof incomingState.weightPre === 'string')
      setWeightPre(incomingState.weightPre);
    if (typeof incomingState.weightCurrent === 'string')
      setWeightCurrent(incomingState.weightCurrent);
    if (typeof incomingState.gestationalWeek === 'string')
      setGestationalWeek(incomingState.gestationalWeek);

    if (typeof incomingState.isMultiplePregnancy !== 'undefined')
      setIsMultiple(incomingState.isMultiplePregnancy ?? null);
    if (typeof incomingState.miscarriageHistory !== 'undefined')
      setMiscarriageHistory(incomingState.miscarriageHistory ?? null);
    if (typeof incomingState.isFirstbirth !== 'undefined')
      setIsFirstbirth(incomingState.isFirstbirth ?? null);

    if (typeof incomingState.miscarriageCount === 'string')
      setMiscarriageCount(incomingState.miscarriageCount);
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

    // 저장 성공 후 토스트/모달 등 처리(추후)
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
