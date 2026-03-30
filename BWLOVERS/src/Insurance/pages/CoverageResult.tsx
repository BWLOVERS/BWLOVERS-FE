import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCoverageStore } from '../stores/coverageStore';
import { coverageApi } from '@/apis/insurance/coverageApi';
import type { CoverageSimulateResultResponse } from '@/apis/insurance/coverageApi';
import CoverageResultView from '../components/CoverageResultView';
import Header from '@/common/components/Header';

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

  const insurance = useMemo(() => {
    if (ai) {
      return {
        productName: ai.product_name,
        insuranceCompany: ai.insurance_company,
        longTerm: ai.is_long_term,
        sumInsured: ai.sum_insured,
        monthlyCost: ai.monthly_cost,
        memo: ai.memo
      };
    }

    if (!selectedInsurance) return undefined;

    return {
      productName: selectedInsurance.productName,
      insuranceCompany: selectedInsurance.insuranceCompany,
      longTerm: selectedInsurance.longTerm,
      sumInsured: selectedInsurance.sumInsured,
      monthlyCost: selectedInsurance.monthlyCost,
      memo: selectedInsurance.memo,
      createdAt: selectedInsurance.createdAt
    };
  }, [ai, selectedInsurance]);

  const selectedContractNames =
    navState?.selectedContractNames ??
    ai?.special_contracts.map((c) => c.contract_name) ??
    [];

  const situation = navState?.situation ?? ai?.question ?? '';

  const handleClickSave = () => {
    setIsSaveConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (isSaving) return;

    const resultId = params.resultId;
    if (!resultId) {
      window.alert('잘못된 접근입니다.');
      return;
    }

    setIsSaving(true);
    try {
      await coverageApi.saveSimulationResult(resultId);

      setIsSaveConfirmOpen(false);
      setIsSaveDoneOpen(true);
    } catch (e) {
      console.error(e);
      setIsSaveConfirmOpen(false);
      window.alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDoneClose = () => {
    setIsSaveDoneOpen(false);
  };

  if (isFetching) {
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
    <CoverageResultView
      onBack={() => navigate('/insurance')}
      insurance={insurance}
      selectedContractNames={selectedContractNames}
      situation={situation}
      resultText={ai.result}
      showActions={true}
      onRetry={() => navigate('/insurance/coverage', { replace: true })}
      onClickSave={handleClickSave}
      isSaveConfirmOpen={isSaveConfirmOpen}
      isSaveDoneOpen={isSaveDoneOpen}
      isSaving={isSaving}
      onCloseSaveConfirm={() => setIsSaveConfirmOpen(false)}
      onConfirmSave={handleConfirmSave}
      onCloseSaveDone={handleSaveDoneClose}
      isCardOpen={isCardOpen}
      onToggleCard={() => setIsCardOpen((prev) => !prev)}
    />
  );
}
