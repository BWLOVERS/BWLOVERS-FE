import { useMemo, useState } from 'react';
import Header from '@/common/components/Header';
import InsuranceCard from '@/Insurance/components/InsuranceCard';

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

export default function MyInsuranceList() {
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

  const [openInsuranceId, setOpenInsuranceId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenInsuranceId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id: number) => {
    // ✅ TODO: 여기서 삭제 모달 띄우거나 API 연결
    console.log('삭제하기 클릭:', id);
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        <Header title="내가 저장한 보험" />
      </div>

      <div className="flex flex-col gap-3 px-[1.8rem] py-4">
        {items.map((item) => (
          <InsuranceCard
            key={item.insuranceId}
            showForwardIcon={false}
            showMoreIcon
            onDelete={() => handleDelete(item.insuranceId)}
            productName={item.productName}
            insuranceCompany={item.insuranceCompany}
            isLongTerm={item.longTerm}
            sumInsured={item.sumInsured}
            monthlyCost={item.monthlyCost}
            memo={item.memo}
            createdAt={item.createdAt}
            expandable
            isOpen={openInsuranceId === item.insuranceId}
            onToggle={() => toggle(item.insuranceId)}
            specialContractNames={item.specialContractNames}
          />
        ))}
      </div>
    </>
  );
}
