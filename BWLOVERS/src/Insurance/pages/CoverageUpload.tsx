import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/common/components/Header';
import LoadIcon from '@/assets/Insurance/icon_load.svg?react';
import InfoIcon from '@/assets/common/icon_information.svg?react';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import { useCoverageStore } from '../stores/coverageStore';
import { useEffect, useMemo, useState } from 'react';
import ContractEditModal from '../components/ContractEditModal';

export default function CoverageUpload() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedInsurance, clearSelectedInsurance } = useCoverageStore();
  const [situation, setSituation] = useState('');
  const [isSelectedCardOpen, setIsSelectedCardOpen] = useState(false);
  const isSituationValid = situation.trim().length > 0;
  const canSubmit = Boolean(selectedInsurance) && isSituationValid;

  const [simSelectedContracts, setSimSelectedContracts] = useState<string[]>(
    []
  );
  const [isContractEditModalOpen, setIsContractEditModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedInsurance) {
      setSimSelectedContracts([]);
      return;
    }

    const defaultNames =
      selectedInsurance.specialContracts?.map((c) => c.contractName) ?? [];
    setSimSelectedContracts(defaultNames);
  }, [selectedInsurance]);

  useEffect(() => {
    const from = (location.state as { from?: string } | null)?.from;

    if (from !== 'select') {
      clearSelectedInsurance();
      setIsSelectedCardOpen(false);
    }
  }, [location.state, clearSelectedInsurance]);

  const contractObjects = useMemo(
    () =>
      (selectedInsurance?.specialContracts ?? []).map((c) => ({
        contract_name: c.contractName
      })),
    [selectedInsurance]
  );

  const handleSubmit = () => {
    if (!selectedInsurance) return;

    // ✅ 이름 -> id 변환 (API에 보낼 건 id)
    const selectedContractIds = (selectedInsurance.specialContracts ?? [])
      .filter((c) => simSelectedContracts.includes(c.contractName))
      .map((c) => c.contractId);

    const payload = {
      insuranceId: selectedInsurance.insuranceId,
      selectedContractIds, // ✅ number[]
      selectedContractNames: simSelectedContracts, // (Result 카드 표시용으로만)
      question: situation // ✅ API 필드명 question
    };

    // ✅ Loading으로 이동 (Loading에서 POST→GET 후 Result 이동)
    navigate('/insurance/coverage/loading', { state: payload });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title="보장 분석" onBack={() => navigate('/insurance')} />
      </div>
      <div className="flex flex-1 flex-col gap-10 px-9 py-8">
        <div className="flex flex-col gap-3">
          <div className="flex text-body-lg text-black">
            1. 시뮬레이션할 보험 선택
          </div>

          {!selectedInsurance ? (
            <div className="flex flex-col gap-3 rounded-2xl border-2 border-gray-20 p-3">
              <button
                type="button"
                onClick={() =>
                  navigate('/myinsurance/select', {
                    state: { from: 'coverage' }
                  })
                }
                className="flex w-full flex-row items-center justify-center gap-4 rounded-2xl bg-pink-20 p-4 text-body-md hover:bg-pink-40"
              >
                <LoadIcon />
                내가 저장한 보험 불러오기
              </button>
              <div className="flex items-center justify-center gap-2 text-caption-md text-gray-60">
                <InfoIcon className="h-3 w-3" />
                내가 저장한 보험 중 하나를 골라 시뮬레이션 결과를 확인할 수
                있습니다.
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <InsuranceCard
                showForwardIcon={false}
                showMoreIcon={false}
                onClick={() => setIsSelectedCardOpen((prev) => !prev)}
                productName={selectedInsurance.productName}
                insuranceCompany={selectedInsurance.insuranceCompany}
                isLongTerm={selectedInsurance.longTerm}
                sumInsured={selectedInsurance.sumInsured}
                monthlyCost={selectedInsurance.monthlyCost}
                memo={selectedInsurance.memo}
                createdAt={selectedInsurance.createdAt}
                expandable
                specialContractNames={simSelectedContracts}
                isOpen={isSelectedCardOpen}
                onToggle={() => setIsSelectedCardOpen((prev) => !prev)}
                hideDetailButton
              />

              <button
                type="button"
                onClick={() => setIsContractEditModalOpen(true)}
                className="w-full rounded-2xl bg-pink-20 py-3 text-body-md text-black shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-pink-40"
              >
                시뮬레이션 할 특약 편집하기
              </button>

              <button
                type="button"
                onClick={() => {
                  clearSelectedInsurance();
                  navigate('/myinsurance/select', {
                    state: { from: 'coverage' }
                  });
                }}
                className="w-full rounded-2xl bg-white py-3 text-body-md text-gray-80 shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-gray-10"
              >
                다른 보험 선택하기
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex text-body-lg text-black">
            2. 시뮬레이션 상황 입력
          </div>
          <textarea
            className="h-80 w-full resize-none rounded-20 bg-gray-10 p-4"
            placeholder="보장 여부를 확인하고 싶은 상황을 상세하게 입력해주세요. "
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="text-body-bold-md mt-auto w-full rounded-full bg-pink-60 py-4 font-bold text-black hover:bg-pink-80 disabled:bg-gray-20 disabled:text-gray-60"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          결과 보기
        </button>
      </div>

      <ContractEditModal
        open={isContractEditModalOpen}
        onClose={() => setIsContractEditModalOpen(false)}
        contracts={contractObjects}
        initialSelectedNames={simSelectedContracts}
        onApply={({ selectedContracts }) =>
          setSimSelectedContracts(selectedContracts.map((c) => c.contract_name))
        }
      />
    </div>
  );
}
