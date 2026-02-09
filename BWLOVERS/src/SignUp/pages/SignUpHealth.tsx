import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import ProgressBar from '@/common/components/ProgressBar';
import { useNavigate } from 'react-router-dom';
import Notice from '../components/Notice';
import HealthForm from '../components/HealthForm';
import { useCallback, useMemo, useState } from 'react';

export default function SignUpHealth() {
  const navigate = useNavigate();

  const handleDone = () => {
    navigate('/home');
  };

  const handleBack = () => {
    navigate('/signup/info');
  };

  const [healthCompleted, setHealthCompleted] = useState<
    Record<1 | 2 | 3, boolean>
  >({
    1: false,
    2: false,
    3: false
  });

  const isAllCompleted = useMemo(() => {
    return healthCompleted[1] && healthCompleted[2] && healthCompleted[3];
  }, [healthCompleted]);

  const handleHealthCompleteChange = useCallback(
    (variant: 1 | 2 | 3, completed: boolean) => {
      setHealthCompleted((prev) => {
        if (prev[variant] === completed) return prev;
        return { ...prev, [variant]: completed };
      });
    },
    []
  );

  return (
    <>
      <Header title="산모 건강 상태" />

      <main className="mt-5 mb-10 flex flex-1 flex-col items-center">
        <Notice />
        <div className="mt-[3.31rem] flex flex-col gap-10.25">
          <div className="text-body-md text-black">
            1. 임신 전 진단 및 치료 받은 질환 (과거병력)
            <HealthForm
              variant={1}
              onCompleteChange={handleHealthCompleteChange}
            />
          </div>

          <div className="text-body-md text-black">
            2. 임신 전부터 현재까지 관리 중인 만성 질환
            <p className="mt-0.5 text-body-xs text-black">
              (임신 전부터 현재까지 지속적 관리 및 치료 중인 항목 선택)
            </p>
            <HealthForm
              variant={2}
              onCompleteChange={handleHealthCompleteChange}
            />
          </div>

          <div className="text-body-md text-black">
            3. 이번 임신과 관련해 의사에게 진단받은 사항
            <HealthForm
              variant={3}
              onCompleteChange={handleHealthCompleteChange}
            />
          </div>
        </div>
      </main>

      <div className="flex w-full justify-between px-11.5 pb-9.75">
        <ActionButton
          label="<- 이전"
          variant="secondary"
          onClick={handleBack}
        />
        <ActionButton
          disabled={!isAllCompleted}
          label="완료"
          variant="primary"
          onClick={handleDone}
        />
      </div>

      <div className="sticky bottom-0 z-50">
        <div className="relative">
          <ProgressBar currentStep={3} />
        </div>
      </div>
    </>
  );
}
