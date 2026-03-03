import Header from '@/common/components/Header';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import { useCoverageStore } from '../stores/coverageStore';
import DoubleBtnModal from '@/common/components/DoubleBtnModal';
import SingleBtnModal from '@/common/components/SingleBtnModal';
import { coverageApi } from '@/apis/insurance/coverageApi';
import type { CoverageSimulateResultResponse } from '@/apis/insurance/coverageApi';

type CoverageResultLocationState = {
  selectedContractNames?: string[];
  situation?: string;
};

export default function CoverageResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ resultId: string }>();

  const { selectedInsurance } = useCoverageStore();
  const [isCardOpen, setIsCardOpen] = useState(false);

  const [ai, setAi] = useState<CoverageSimulateResultResponse | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [isSaveDoneOpen, setIsSaveDoneOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navState = location.state as CoverageResultLocationState | null;

  const selectedContractNames = navState?.selectedContractNames ?? [];
  const situation = navState?.situation ?? '';

  useEffect(() => {
    const resultId = params.resultId;

    if (!resultId) {
      navigate('/insurance/coverage', { replace: true });
      return;
    }

    const run = async () => {
      setIsFetching(true);
      try {
        const data = await coverageApi.getSimulationResult(resultId);
        setAi(data);
      } catch (e) {
        console.error(e);
        window.alert('결과를 불러오지 못했습니다.');
        navigate('/insurance/coverage', { replace: true });
      } finally {
        setIsFetching(false);
      }
    };

    run();
  }, [params.resultId, navigate]);

  // ✅ 보험 카드 표시를 위해 selectedInsurance가 필요하다면 기존대로 유지
  //    (새로고침 시 store가 비어있을 수 있음 → 이 경우 카드 영역만 숨기거나, 보험 재선택 유도)
  const canShowInsuranceCard = Boolean(selectedInsurance);

  const handleClickSave = () => {
    setIsSaveConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      //추후 api 연결
      await new Promise((r) => setTimeout(r, 300));

      setIsSaveConfirmOpen(false);
      setIsSaveDoneOpen(true);
    } catch (e) {
      console.error(e);
      setIsSaveConfirmOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDoneClose = () => {
    setIsSaveDoneOpen(false);
    navigate('/home', { replace: true });
  };

  if (isFetching) {
    // 원하면 Loading 컴포넌트 재사용 가능
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="sticky top-0 z-50 bg-white">
          <Header title="보장 분석" onBack={() => navigate('/insurance')} />
        </div>
        <div className="flex flex-1 items-center justify-center px-9 py-8">
          <div className="text-body-md text-gray-80">결과 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!ai) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title="보장 분석" onBack={() => navigate('/insurance')} />
      </div>

      <div className="flex flex-1 flex-col gap-10 px-9 py-8">
        {/* 보험 카드 (store 없으면 숨김) */}
        {canShowInsuranceCard && (
          <div className="flex flex-col gap-3">
            <div className="flex text-body-lg text-black">보험 정보</div>

            <InsuranceCard
              showForwardIcon={false}
              showMoreIcon={false}
              onClick={() => setIsCardOpen((prev) => !prev)}
              productName={selectedInsurance!.productName}
              insuranceCompany={selectedInsurance!.insuranceCompany}
              isLongTerm={selectedInsurance!.longTerm}
              sumInsured={selectedInsurance!.sumInsured}
              monthlyCost={selectedInsurance!.monthlyCost}
              memo={selectedInsurance!.memo}
              createdAt={selectedInsurance!.createdAt}
              expandable
              specialContractNames={selectedContractNames}
              isOpen={isCardOpen}
              onToggle={() => setIsCardOpen((prev) => !prev)}
              hideDetailButton
            />
          </div>
        )}

        {/* 사용자 입력 상황 (새로고침이면 비어있을 수 있음) */}
        {situation && (
          <div className="flex flex-col gap-3">
            <div className="flex text-body-lg text-black">시뮬레이션 상황</div>
            <div className="rounded-20 bg-gray-10 p-4 text-body-md whitespace-pre-wrap text-black">
              {situation}
            </div>
          </div>
        )}

        {/* AI 답변 */}
        <div className="flex flex-col gap-3">
          <div className="flex text-body-lg text-black">
            위 보험과 상황의 경우
          </div>

          <div className="rounded-20 bg-white p-4 text-body-md whitespace-pre-wrap text-black shadow-[0_0_4px_0_rgba(0,0,0,0.10)]">
            {ai.result}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate('/insurance/coverage', { replace: true })}
            className="text-body-bold-md w-full rounded-full bg-white py-4 font-bold text-black shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-gray-10"
          >
            다시 분석하기
          </button>
          <div className="flex flex-row gap-1.5">
            <button
              type="button"
              onClick={handleClickSave}
              className="text-body-bold-md w-full rounded-full bg-pink-60 py-4 font-bold text-black shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-pink-80"
            >
              분석 리포트 저장하기
            </button>
            <button
              type="button"
              className="text-body-bold-md w-full rounded-full bg-pink-60 py-4 font-bold text-black shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-pink-80"
            >
              PDF로 내용 추출하기
            </button>
          </div>
        </div>
      </div>

      <DoubleBtnModal
        open={isSaveConfirmOpen}
        title="시뮬레이션 결과를 저장할까요?"
        content={isSaving ? '저장 중입니다...' : undefined}
        confirmLabel="예"
        cancelLabel="아니오"
        onClose={() => setIsSaveConfirmOpen(false)}
        onConfirm={handleConfirmSave}
      />

      <SingleBtnModal
        open={isSaveDoneOpen}
        title="결과 저장 완료"
        content="저장된 리포트는 홈에서 확인할 수 있습니다."
        onClose={handleSaveDoneClose}
        onConfirm={handleSaveDoneClose}
      />
    </div>
  );
}
