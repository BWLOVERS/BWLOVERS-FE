import Header from '@/common/components/Header';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import { useCoverageStore } from '../stores/coverageStore';
import DoubleBtnModal from '@/common/components/DoubleBtnModal';
import SingleBtnModal from '@/common/components/SingleBtnModal';

type CoverageResultState = {
  insuranceId: number;
  productName: string;
  selectedContractNames: string[];
  situation: string;
};

type DummyAiResponse = {
  resultId: string;
  question: string;
  result: string;
};

export default function CoverageResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedInsurance } = useCoverageStore();
  const [isCardOpen, setIsCardOpen] = useState(false);

  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  const [isSaveDoneOpen, setIsSaveDoneOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const state = location.state as CoverageResultState | null;

  if (!state || !selectedInsurance) {
    navigate('/insurance/coverage', { replace: true });
    return null;
  }

  const { selectedContractNames, situation } = state;

  const ai: DummyAiResponse = useMemo(
    () => ({
      resultId: '1f5a2d8ecc1549e28f9fafe81389cd8d',
      question: situation,
      result:
        '임신 20주에 임신중독증이 발생한 경우, 귀하의 보험 상품에서 제공하는 보장 내용을 다음과 같이 분석할 수 있습니다...\n\n(여기에 백엔드 result 문자열 그대로 렌더링)'
    }),
    [situation]
  );

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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title="보장 분석" onBack={() => navigate('/insurance')} />
      </div>

      <div className="flex flex-1 flex-col gap-10 px-9 py-8">
        {/* 보험 카드 */}
        <div className="flex flex-col gap-3">
          <div className="flex text-body-lg text-black">보험 정보</div>

          <InsuranceCard
            showForwardIcon={false}
            showMoreIcon={false}
            onClick={() => setIsCardOpen((prev) => !prev)}
            productName={selectedInsurance.productName}
            insuranceCompany={selectedInsurance.insuranceCompany}
            isLongTerm={selectedInsurance.longTerm}
            sumInsured={selectedInsurance.sumInsured}
            monthlyCost={selectedInsurance.monthlyCost}
            memo={selectedInsurance.memo}
            createdAt={selectedInsurance.createdAt}
            expandable
            specialContractNames={selectedContractNames}
            isOpen={isCardOpen}
            onToggle={() => setIsCardOpen((prev) => !prev)}
            hideDetailButton
          />
        </div>

        {/* 사용자 입력 상황 그대로 표시 */}
        <div className="flex flex-col gap-3">
          <div className="flex text-body-lg text-black">시뮬레이션 상황</div>
          <div className="rounded-20 bg-gray-10 p-4 text-body-md whitespace-pre-wrap text-black">
            {situation}
          </div>
        </div>

        {/*  AI 답변 */}
        <div className="flex flex-col gap-3">
          <div className="flex text-body-lg text-black">
            위 보험과 상황의 경우..
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
