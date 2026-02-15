import { useState } from 'react';
import SpecialContractAccordion from './SpecialContractAccordion';
import InfoIcon from '@/assets/common/icon_information.svg?react';

type SpecialContract = {
  contract_name: string;
  contract_description: string;
  contract_recommendation_reason: string;
  key_features: string[];
  page_number: number;
};

type SpecialContractsSectionProps = {
  contracts: SpecialContract[];
  onSave?: () => void; // "나만의 조합 저장하기" 버튼용
};

export default function SpecialContractsSection({
  contracts,
  onSave
}: SpecialContractsSectionProps) {
  // 여러 개 열기: 열린 index들을 Set으로 관리
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => new Set());

  const handleToggle = (idx: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <section className="flex flex-col gap-3">
      {/* 타이틀 + 버튼 */}
      <div className="flex items-center justify-between">
        <div className="text-body-bold-md text-black">고려하면 좋을 특약</div>
      </div>

      {/* 리스트 */}
      <div className="flex flex-col gap-3">
        {contracts.map((c, idx) => (
          <SpecialContractAccordion
            key={`${c.contract_name}-${idx}`}
            contract={c}
            isOpen={openIndexes.has(idx)}
            onToggle={() => handleToggle(idx)}
          />
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-2">
        <button
          type="button"
          onClick={onSave}
          className="text-body-bold-md w-full rounded-full bg-pink-60 py-4 font-bold text-black"
        >
          나만의 특약 조합 저장하기
        </button>
        <div className="mt-3 flex flex-row items-center gap-2 text-caption-lg text-gray-60">
          <InfoIcon />
          나만의 조합 저장하기 기능이란?
        </div>
        <div className="text-caption-md text-gray-60">
          AI가 추천해준 특약 중 일부만 선택하여 마이페이지에 저장하는
          기능입니다.
          <br />
          저장된 조합은 보장 시뮬레이션(보장분석) 기능에서 불러와 사용할 수
          있고, 보장 분석 기능에서는 저장 시 선택한 항목 내에서 다시 한 번
          선택할 수 있습니다.
          <br /> ※ 지금 저장하지 않은 결과는 추후 AI 추천 시엔 동일하게 나타나지
          않을 수 있습니다.
        </div>
      </div>
    </section>
  );
}
