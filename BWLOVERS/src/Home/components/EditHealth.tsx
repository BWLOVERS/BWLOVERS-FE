import ActionButton from '@/common/components/ActionButton';
import SingleBtnModal from '@/common/components/SingleBtnModal';
import HealthForm, {
  type HealthFormValue
} from '@/SignUp/components/HealthForm';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { healthStatusApi } from '@/apis/users/healthStatusApi';
import { useHealthStatusStore } from '@/SignUp/stores/healthStatusStore';

export default function EditHealth() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const v1 = useHealthStatusStore((s) => s.v1);
  const v2 = useHealthStatusStore((s) => s.v2);
  const v3 = useHealthStatusStore((s) => s.v3);
  const setVariantValue = useHealthStatusStore((s) => s.setVariantValue);
  const setAll = useHealthStatusStore((s) => s.setAll);

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

  const handleHealthValueChange = useCallback(
    (variant: 1 | 2 | 3, value: HealthFormValue) => {
      setVariantValue(variant, value);
    },
    [setVariantValue]
  );

  const hasLoaded = useHealthStatusStore((s) => s.hasLoaded);

  useEffect(() => {
    if (hasLoaded) return;

    const run = async () => {
      try {
        const draft = await healthStatusApi.getHealthStatusDraft();
        setAll(draft);
      } catch (e) {
        if (import.meta.env.DEV) console.log('[GET health-status failed]', e);
      }
    };

    run();
  }, [hasLoaded, setAll]);

  const handleSave = async () => {
    if (!isAllCompleted) return;

    const payload = { v1, v2, v3 };
    if (import.meta.env.DEV) console.log('EDIT HEALTH SAVE PAYLOAD:', payload);

    try {
      await healthStatusApi.putHealthStatusDraft(payload);
      setAll(payload);

      setIsModalOpen(true);
    } catch (e) {
      if (import.meta.env.DEV) console.log('[PUT health-status failed]', e);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-10.25">
        <div className="text-body-md text-black">
          1. 임신 전 진단 및 치료 받은 질환 (과거병력)
          <HealthForm
            variant={1}
            onCompleteChange={handleHealthCompleteChange}
            onValueChange={handleHealthValueChange}
            value={v1}
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
            onValueChange={handleHealthValueChange}
            value={v2}
          />
        </div>

        <div className="text-body-md text-black">
          3. 이번 임신과 관련해 의사에게 진단받은 사항
          <HealthForm
            variant={3}
            onCompleteChange={handleHealthCompleteChange}
            onValueChange={handleHealthValueChange}
            value={v3}
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

      <SingleBtnModal
        open={isModalOpen}
        title="수정 완료"
        content={`회원 정보가 수정되었습니다.`}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
      />
    </>
  );
}
