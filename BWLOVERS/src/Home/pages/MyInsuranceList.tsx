import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/common/components/Header';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import { useCoverageStore } from '@/Insurance/stores/coverageStore';
import {
  insurancesApi,
  type InsuranceDetailListItem
} from '@/apis/insurance/insurancesApi';

type SavedInsuranceItem = {
  insuranceId: number;
  insuranceCompany: string;
  productName: string;
  sumInsured: number;
  monthlyCost?: string;
  memo?: string;
  createdAt: string;
  specialContractNames: string[];
  longTerm: boolean;
};

type MyInsuranceListProps = {
  mode?: 'manage' | 'select';
};

export default function MyInsuranceList({
  mode = 'manage'
}: MyInsuranceListProps) {
  const navigate = useNavigate();
  const { setSelectedInsurance } = useCoverageStore();

  const isSelectMode = mode === 'select';

  const [items, setItems] = useState<SavedInsuranceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // 선택 모드에서는 openInsuranceId가 "선택된 보험" 역할
  const [openInsuranceId, setOpenInsuranceId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);

        const data: InsuranceDetailListItem[] =
          await insurancesApi.getMyInsuranceList();

        const mapped: SavedInsuranceItem[] = data.map((it) => ({
          insuranceId: it.insuranceId,
          insuranceCompany: it.insuranceCompany,
          productName: it.productName,
          sumInsured: it.sumInsured,
          monthlyCost: it.monthlyCost,
          memo: it.memo,
          createdAt: it.createdAt,
          specialContractNames: (it.specialContracts ?? []).map(
            (c) => c.contractName
          ),
          longTerm: it.longTerm
        }));

        // (선택) 최신순 정렬
        mapped.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setItems(mapped);
      } catch (e) {
        console.error('getMyInsuranceDetails failed:', e);
        window.alert(
          '보험 리스트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleDelete = async (id: number) => {
    // 연타/중복 요청 방지
    if (deletingIds.has(id)) return;

    // const ok = window.confirm('해당 보험을 삭제하시겠습니까?');
    // if (!ok) return;

    setDeletingIds((prev) => new Set(prev).add(id));

    const prevItems = items;
    setItems((prev) => prev.filter((it) => it.insuranceId !== id));

    try {
      await insurancesApi.deleteInsurance(id);

      // 선택 모드에서 삭제한 게 선택되어 있던 카드면 선택 해제
      setOpenInsuranceId((prev) => (prev === id ? null : prev));
    } catch (e) {
      console.error('deleteInsurance failed:', e);
      window.alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');

      // 롤백
      setItems(prevItems);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleCardClickInSelectMode = (id: number) => {
    setOpenInsuranceId((prev) => (prev === id ? null : id));
  };

  const selectedItem = useMemo(() => {
    if (!openInsuranceId) return null;
    return items.find((it) => it.insuranceId === openInsuranceId) ?? null;
  }, [items, openInsuranceId]);

  const handleConfirmSelect = () => {
    if (!selectedItem) return;
    setSelectedInsurance(selectedItem);
    navigate('/insurance/coverage', { state: { from: 'select' } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title={isSelectMode ? '보험 선택' : '내가 저장한 보험'} />
      </div>

      {/* ✅ 선택 모드면 하단 버튼 때문에 padding-bottom 확보 */}
      <div
        className={`flex flex-col gap-3 px-[1.8rem] py-4 ${
          isSelectMode ? 'pb-28' : ''
        }`}
      >
        {isLoading ? (
          <div className="text-body-sm text-gray-60">불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="text-body-sm text-gray-60">
            저장한 보험이 없습니다.
          </div>
        ) : (
          items.map((item) => (
            <InsuranceCard
              insuranceId={item.insuranceId}
              key={item.insuranceId}
              showForwardIcon={false}
              // 선택 모드: 옵션/자세히(더보기) 없음
              showMoreIcon={!isSelectMode}
              onDelete={
                !isSelectMode ? () => handleDelete(item.insuranceId) : undefined
              }
              // 선택 모드: 카드 클릭하면 펼쳐짐(=선택)
              onClick={
                isSelectMode
                  ? () => handleCardClickInSelectMode(item.insuranceId)
                  : undefined
              }
              productName={item.productName}
              insuranceCompany={item.insuranceCompany}
              isLongTerm={item.longTerm}
              sumInsured={item.sumInsured}
              monthlyCost={item.monthlyCost}
              memo={item.memo}
              createdAt={item.createdAt}
              expandable
              isSelected={isSelectMode && openInsuranceId === item.insuranceId}
              hideDetailButton={isSelectMode}
              isOpen={openInsuranceId === item.insuranceId}
              onToggle={() =>
                isSelectMode
                  ? handleCardClickInSelectMode(item.insuranceId)
                  : setOpenInsuranceId((prev) =>
                      prev === item.insuranceId ? null : item.insuranceId
                    )
              }
              specialContractNames={item.specialContractNames}
            />
          ))
        )}
      </div>

      {/* 선택 모드에서만 하단 '선택하기' 버튼 */}
      {isSelectMode && (
        <div className="fixed right-0 bottom-0 left-0 bg-white px-9 pt-3 pb-6">
          <button
            type="button"
            className="text-body-bold-md w-full rounded-full bg-pink-60 py-4 font-bold text-black hover:bg-pink-80 disabled:bg-gray-20 disabled:text-gray-60"
            disabled={!selectedItem}
            onClick={handleConfirmSelect}
          >
            선택하기
          </button>
        </div>
      )}
    </div>
  );
}
