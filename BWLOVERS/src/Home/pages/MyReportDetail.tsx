import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CoverageResultView from '@/Insurance/components/CoverageResultView';
import {
  myreportApi,
  type MyReportDetailResponse
} from '@/apis/insurance/myreportApi';
import Header from '@/common/components/Header';

export default function MyReportDetail() {
  const navigate = useNavigate();
  const params = useParams<{ simulationId: string }>();

  const [data, setData] = useState<MyReportDetailResponse | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(false);

  useEffect(() => {
    const simulationId = Number(params.simulationId);

    if (!params.simulationId || Number.isNaN(simulationId)) {
      navigate('/myreport', { replace: true });
      return;
    }

    const run = async () => {
      setIsFetching(true);
      try {
        const res = await myreportApi.getMyReportDetail(simulationId);
        setData(res);
      } catch (e) {
        console.error(e);
        window.alert('리포트를 불러오지 못했습니다.');
        navigate('/myreport', { replace: true });
      } finally {
        setIsFetching(false);
      }
    };

    run();
  }, [params.simulationId, navigate]);

  const insurance = useMemo(() => {
    if (!data) return undefined;

    return {
      productName: data.productName,
      insuranceCompany: data.insuranceCompany,
      longTerm: data.longTerm,
      sumInsured: data.sumInsured,
      monthlyCost: data.monthlyCost,
      memo: data.memo,
      createdAt: data.createdAt
    };
  }, [data]);

  if (isFetching) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="sticky top-0 z-50 bg-white">
          <Header title="보장 분석" onBack={() => navigate('/insurance')} />
        </div>
        <div className="flex flex-1 items-center justify-center px-9 py-8">
          <div className="text-body-md text-gray-80">리포트 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <CoverageResultView
      onBack={() => navigate('/myreport')}
      insurance={insurance}
      selectedContractNames={data.contracts.map((c) => c.contractName)}
      situation={data.question}
      resultText={data.result}
      showActions={false}
      isCardOpen={isCardOpen}
      onToggleCard={() => setIsCardOpen((prev) => !prev)}
    />
  );
}
