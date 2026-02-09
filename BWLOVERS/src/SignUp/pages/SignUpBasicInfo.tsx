import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import ProgressBar from '@/common/components/ProgressBar';
import LabeledInput from '../components/LabeledInput';
import NumberInput from '../components/NumberInput';
import JobInput from '../components/JobInput';
import ToggleInput from '../components/ToggleInput';
import type {
  SignUpBasicInfoState,
  ToggleValue
} from '../types/signupBasicInfo';
import { onlyDigits, sliceTo8Digits } from '../utils/inputUtils';
import { mergeBasicInfoState } from '../utils/routeState';
import { getBasicInfoValidation } from '../utils/basicInfoValidation';

export default function SignUpBasicInfo() {
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

  const [isNextClicked, setIsNextClicked] = useState(false);

  useEffect(() => {
    if (!incomingState) return;

    if (typeof incomingState.birthDate === 'string')
      setBirthDate(incomingState.birthDate);
    if (typeof incomingState.job === 'string') setJob(incomingState.job);
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
    if (typeof incomingState.isMultiple !== 'undefined')
      setIsMultiple(incomingState.isMultiple ?? null);
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

  const handleNext = () => {
    setIsNextClicked(true);

    if (hasError) return;

    navigate('/signup/health', {
      state: mergeBasicInfoState(incomingState, currentFormState)
    });
  };

  const handleBack = () => {
    navigate('/signup/account', {
      state: mergeBasicInfoState(incomingState, currentFormState)
    });
  };

  const handleJobSearch = () => {
    navigate('/signup/info/job', {
      state: mergeBasicInfoState(incomingState, currentFormState)
    });
  };

  return (
    <>
      <Header title="산모 기본 정보" />

      <main className="item-center mb-1.5 flex w-full flex-1 justify-center">
        <div className="mt-15 mb-28 flex w-73.25 flex-col gap-5">
          <LabeledInput
            label="생년월일"
            placeholder="생년월일 8자리 입력 (ex. 19950101)"
            value={birthDate}
            onChange={handleDateChange(setBirthDate)}
            inError={isNextClicked && errors.birthDate}
            type="tel"
          />

          <JobInput
            value={job}
            onSearch={handleJobSearch}
            inError={isNextClicked && errors.job}
          />

          <NumberInput
            label="키"
            unit="cm"
            value={height}
            onChange={handleNumberChange(setHeight)}
            inError={isNextClicked && errors.height}
          />

          <NumberInput
            label="임신 전 몸무게"
            unit="kg"
            value={weightPre}
            onChange={handleNumberChange(setWeightPre)}
            inError={isNextClicked && errors.weightPre}
          />

          <NumberInput
            label="임신 후(현재) 몸무게"
            unit="kg"
            value={weightCurrent}
            onChange={handleNumberChange(setWeightCurrent)}
            inError={isNextClicked && errors.weightCurrent}
          />

          <NumberInput
            label="임신 주차"
            unit="주차"
            value={gestationalWeek}
            onChange={handleNumberChange(setGestationalWeek)}
            inError={isNextClicked && errors.gestationalWeek}
          />

          <LabeledInput
            label="출산 예정일"
            placeholder="출산 예정일 8자리 입력 (ex. 19950101)"
            type="tel"
            value={expectedDate}
            onChange={handleDateChange(setExpectedDate)}
            inError={isNextClicked && errors.expectedDate}
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
              inError={isNextClicked && errors.miscarriageCount}
            />
          )}
        </div>
      </main>

      <div className="flex w-full justify-between bg-white px-11.5 pb-9.75">
        <ActionButton
          label="<- 이전"
          variant="secondary"
          onClick={handleBack}
        />
        <ActionButton
          label="다음 ->"
          variant="primary"
          onClick={handleNext}
          disabled={!isAllRequiredFilled}
        />
      </div>
      <div className="sticky bottom-0 z-50">
        <div className="relative">
          <ProgressBar currentStep={2} />
        </div>
      </div>
    </>
  );
}
