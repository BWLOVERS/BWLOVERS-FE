import ActionButton from '@/common/components/ActionButton';
import HealthForm from '@/SignUp/components/HealthForm';
import { useCallback, useMemo, useState } from 'react';

export default function EditHealth() {
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

  const handleSave = () => {
    if (!isAllCompleted) return;

    // ✅ 나중에 PATCH API 연결할 payload
    console.log('EDIT HEALTH SAVE PAYLOAD:', healthCompleted);

    // 저장 성공 후 토스트/모달 등 처리(추후)
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-10.25">
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

      <div className="mt-10 flex w-full justify-end px-11.5 pb-9.75">
        <ActionButton
          label="수정"
          variant="primary"
          onClick={handleSave}
          disabled={!isAllCompleted}
        />
      </div>
    </>
  );
}
