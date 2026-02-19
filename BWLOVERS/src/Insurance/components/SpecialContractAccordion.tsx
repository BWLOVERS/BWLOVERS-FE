import { useMemo } from 'react';
import ArrowUpIcon from '@/assets/SignUp/icon_arrow_up.svg?react';
import ArrowDownIcon from '@/assets/SignUp/icon_arrow_down.svg?react';

type SpecialContract = {
  contract_name: string;
  contract_description: string;
  contract_recommendation_reason: string;
  key_features: string[];
  page_number: number;
};

type SpecialContractAccordionProps = {
  contract: SpecialContract;
  isOpen: boolean;
  onToggle: () => void;
};

export default function SpecialContractAccordion({
  contract,
  isOpen,
  onToggle
}: SpecialContractAccordionProps) {
  const Icon = isOpen ? ArrowUpIcon : ArrowDownIcon;

  const featuresText = useMemo(() => {
    if (!contract.key_features?.length) return '-';
    return contract.key_features.join('\n');
  }, [contract.key_features]);

  return (
    <section className="rounded-2xl bg-[#f7f7f7]">
      {/* title */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-gray-80">•</span>
          <span className="text-body-bold-sm text-black">
            {contract.contract_name}
          </span>
        </div>

        <Icon className="h-5 w-5 shrink-0" />
      </button>

      {/* content */}
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="h-px w-full bg-gray-200" />

          <div className="px-2 pt-4">
            {/* 2열 표 형태 */}
            <div className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-6">
              <div className="text-body-bold-sm text-black">특약 설명</div>
              <div className="text-body-sm whitespace-pre-line text-black">
                {contract.contract_description || '-'}
              </div>

              <div className="text-body-bold-sm text-black">주요 특징</div>
              <div className="text-body-sm whitespace-pre-line text-black">
                {featuresText}
              </div>

              <div className="text-body-bold-sm text-black">추천 이유</div>
              <div className="text-body-sm whitespace-pre-line text-black">
                {contract.contract_recommendation_reason || '-'}
              </div>

              <div className="text-body-bold-sm text-black">약관 위치</div>
              <div className="text-body-sm text-black">
                {contract.page_number ? `${contract.page_number}p.` : '-'}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
