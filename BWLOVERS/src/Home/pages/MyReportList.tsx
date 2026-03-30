// MyReportList.tsx
import { useEffect, useState } from 'react';
import Header from '@/common/components/Header';
import ReportItem from '../components/ReportItem';
import {
  myreportApi,
  type MyReportListResponse
} from '@/apis/insurance/myreportApi';
import { useNavigate } from 'react-router-dom';

export default function MyReportList() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<MyReportListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const list = await myreportApi.getMyReportList();

        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setReports(sorted);
      } catch (e) {
        console.error('getMyReportDetails failed:', e);
        window.alert(
          '보장 분석 리포트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDelete = async (simulationId: number) => {
    // 원하시면 DoubleBtnModal로 바꿀 수 있는데, 일단 가장 간단히 confirm
    const ok = window.confirm('해당 시뮬레이션 리포트를 삭제할까요?');
    if (!ok) return;

    try {
      await myreportApi.deleteMyReport(simulationId);

      // ✅ UI 즉시 반영
      setReports((prev) => prev.filter((r) => r.simulationId !== simulationId));
    } catch (e) {
      console.error('deleteMyReport failed:', e);
      window.alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title="보장 분석 리포트" onBack={() => navigate('/home')} />
      </div>

      <div className="flex flex-col gap-3 px-[1.8rem] py-4">
        {isLoading ? (
          <div className="text-body-sm text-gray-60">불러오는 중...</div>
        ) : reports.length === 0 ? (
          <div className="text-body-sm text-gray-60">
            저장한 보장 분석 리포트가 없습니다.
          </div>
        ) : (
          reports.map((item) => (
            <ReportItem
              key={item.simulationId}
              simulationId={item.simulationId}
              productName={item.productName}
              createdAt={item.createdAt}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
