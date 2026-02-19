import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import ProgressBar from '@/common/components/ProgressBar';
import LabeledInput from '../components/LabeledInput';
import NumberInput from '../components/NumberInput';
import JobInput from '../components/JobInput';
import ToggleInput from '../components/ToggleInput';
import { onlyDigits, sliceTo8Digits } from '../utils/inputUtils';
import { getBasicInfoValidation } from '../utils/basicInfoValidation';
import { usePregnancyInfoStore } from '@/stores/pregnancyInfoStore';
import { pregnancyInfoApi } from '@/apis/users/pregnancyInfoApi';

export default function SignUpBasicInfo() {
  const navigate = useNavigate();

  const draft = usePregnancyInfoStore((s) => s.draft);
  const setDraftField = usePregnancyInfoStore((s) => s.setDraftField);
  const setServer = usePregnancyInfoStore((s) => s.setServer);

  const [isNextClicked, setIsNextClicked] = useState(false);

  const handleDateChange =
    (key: 'birthDate' | 'expectedDate') => (v: string) => {
      setDraftField(key, sliceTo8Digits(v));
    };

  const handleNumberChange =
    (
      key:
        | 'height'
        | 'weightPre'
        | 'weightCurrent'
        | 'gestationalWeek'
        | 'miscarriageCount'
    ) =>
    (v: string) => {
      setDraftField(key, onlyDigits(v));
    };

  // validation은 기존 로직 재사용을 위해 shape 맞춰서 전달
  const currentFormState = useMemo(
    () => ({
      birthDate: draft.birthDate,
      job: draft.jobName, // 기존 validation이 job을 본다면 매핑
      expectedDate: draft.expectedDate,
      height: draft.height,
      weightPre: draft.weightPre,
      weightCurrent: draft.weightCurrent,
      gestationalWeek: draft.gestationalWeek,
      isMultiple: draft.isMultiplePregnancy, // 기존 validation이 isMultiple을 본다면 매핑
      miscarriageHistory: draft.miscarriageHistory,
      isFirstbirth: draft.isFirstbirth,
      miscarriageCount: draft.miscarriageCount
    }),
    [draft]
  );

  const { errors, hasError, isAllRequiredFilled } = useMemo(
    () => getBasicInfoValidation(draft),
    [draft]
  );

  // ✅ 응답 확인용 !!
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    console.log('[BASIC INFO]', {
      draft,
      currentFormState,
      errors,
      hasError,
      isAllRequiredFilled
    });
  }, [draft, currentFormState, errors, hasError, isAllRequiredFilled]);

  const handleNext = async () => {
    setIsNextClicked(true);
    if (hasError) return;

    try {
      const saved = await pregnancyInfoApi.postPregnancyInfo(draft);
      setServer(saved);
      navigate('/signup/health');
    } catch (e) {
      // ✅ 여기 찍히면 axios 인터셉터 [ERR]도 같이 찍힐 거예요
      if (import.meta.env.DEV) console.log('[POST pregnancy-info failed]', e);
    }
  };

  const handleBack = () => {
    navigate('/signup/account');
  };

  const handleJobSearch = () => {
    navigate('/jobs', { state: { returnTo: '/signup/info' } });
  };

  return (
    <>
      <Header title="산모 기본 정보" />

      <main className="item-center mb-1.5 flex w-full flex-1 justify-center">
        <div className="mt-15 mb-28 flex w-73.25 flex-col gap-5">
          <LabeledInput
            label="생년월일"
            placeholder="생년월일 8자리 입력 (ex. 19950101)"
            value={draft.birthDate}
            onChange={handleDateChange('birthDate')}
            inError={isNextClicked && errors.birthDate}
            type="tel"
          />

          <JobInput
            value={draft.jobName}
            onSearch={handleJobSearch}
            inError={isNextClicked && errors.job}
          />

          <NumberInput
            label="키"
            unit="cm"
            value={draft.height}
            onChange={handleNumberChange('height')}
            inError={isNextClicked && errors.height}
          />

          <NumberInput
            label="임신 전 몸무게"
            unit="kg"
            value={draft.weightPre}
            onChange={handleNumberChange('weightPre')}
            inError={isNextClicked && errors.weightPre}
          />

          <NumberInput
            label="임신 후(현재) 몸무게"
            unit="kg"
            value={draft.weightCurrent}
            onChange={handleNumberChange('weightCurrent')}
            inError={isNextClicked && errors.weightCurrent}
          />

          <NumberInput
            label="임신 주차"
            unit="주차"
            value={draft.gestationalWeek}
            onChange={handleNumberChange('gestationalWeek')}
            inError={isNextClicked && errors.gestationalWeek}
          />

          <LabeledInput
            label="출산 예정일"
            placeholder="출산 예정일 8자리 입력 (ex. 20260520)"
            type="tel"
            value={draft.expectedDate}
            onChange={handleDateChange('expectedDate')}
            inError={isNextClicked && errors.expectedDate}
          />

          <ToggleInput
            label="초산 여부"
            leftLabel="예"
            rightLabel="아니오"
            value={draft.isFirstbirth}
            onChange={(v) => setDraftField('isFirstbirth', v)}
          />

          <ToggleInput
            label="다태아(쌍둥이 여부)"
            leftLabel="예"
            rightLabel="아니오"
            value={draft.isMultiplePregnancy}
            onChange={(v) => setDraftField('isMultiplePregnancy', v)}
          />

          <ToggleInput
            label="유산 경험"
            leftLabel="있음"
            rightLabel="없음"
            value={draft.miscarriageHistory}
            onChange={(v) => {
              setDraftField('miscarriageHistory', v);
              if (v === 'no') setDraftField('miscarriageCount', '');
            }}
          />

          {draft.miscarriageHistory === 'yes' && (
            <NumberInput
              label="유산 횟수"
              unit="회"
              value={draft.miscarriageCount}
              onChange={handleNumberChange('miscarriageCount')}
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
