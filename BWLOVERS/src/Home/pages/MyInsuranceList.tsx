import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/common/components/Header';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import { useCoverageStore } from '@/Insurance/stores/coverageStore';

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

  const items: SavedInsuranceItem[] = useMemo(
    () => [
      {
        insuranceId: 1,
        insuranceCompany: '삼성화재',
        productName:
          '무배당 삼성화재 다이렉트 임산부ㆍ아기보험(해약환급금 미지급형Ⅱ)',
        sumInsured: 15000,
        monthlyCost: '40,056원',
        memo: '메모입니다메모입니다메모입니다메모입니다',
        createdAt: '2026-02-11T19:54:25.274782',
        specialContractNames: [
          '임신중독증 진단비 특별약관',
          '유산 위로금 특별약관'
        ],
        longTerm: true
      },
      {
        insuranceId: 2,
        insuranceCompany: '삼성화재',
        productName:
          '무배당 삼성화재 다이렉트 임산부ㆍ아기보험(해약환급금 미지급형Ⅱ)',
        sumInsured: 15000,
        monthlyCost: '40,056원',
        memo: '메모입니다.',
        createdAt: '2026-02-11T19:54:25.274782',
        specialContractNames: [
          '임신중독증 진단비 특별약관',
          '유산 위로금 특별약관'
        ],
        longTerm: true
      }
    ],
    []
  );

  const isSelectMode = mode === 'select';

  // 선택 모드에서는 openInsuranceId가 "선택된 보험" 역할
  const [openInsuranceId, setOpenInsuranceId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    console.log('삭제하기 클릭:', id);
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
        className={`flex flex-col gap-3 px-[1.8rem] py-4 ${isSelectMode ? 'pb-28' : ''}`}
      >
        {items.map((item) => (
          <InsuranceCard
            key={item.insuranceId}
            showForwardIcon={false}
            //선택 모드: 옵션/자세히(더보기) 없음
            showMoreIcon={!isSelectMode}
            onDelete={
              !isSelectMode ? () => handleDelete(item.insuranceId) : undefined
            }
            //선택 모드: 카드 클릭하면 펼쳐짐(=선택)
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
            // 선택 모드에서는 토글도 카드 클릭과 동일하게 처리(아예 같은 동작)
            onToggle={() =>
              isSelectMode
                ? handleCardClickInSelectMode(item.insuranceId)
                : setOpenInsuranceId((prev) =>
                    prev === item.insuranceId ? null : item.insuranceId
                  )
            }
            specialContractNames={item.specialContractNames}
          />
        ))}
      </div>

      {/* ✅ 선택 모드에서만 하단 '선택하기' 버튼 */}
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
