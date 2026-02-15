import PeriodTag from './PeriodTag';
import ForwardIcon from '@/assets/Home/icon_forward.svg?react';

type InsuranceCardProps = {
  showForwardIcon?: boolean;
  onClick?: () => void;

  // ✅ 추가: 카드에 뿌릴 데이터
  productName: string;
  insuranceCompany: string;
  isLongTerm: boolean;
  sumInsured: number;
  monthlyCost: string;
  specialContractCount?: number;
};

export default function InsuranceCard({
  showForwardIcon = true,
  onClick,
  productName,
  insuranceCompany,
  isLongTerm,
  sumInsured,
  monthlyCost,
  specialContractCount
}: InsuranceCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <div
      {...(isClickable
        ? {
            role: 'button' as const,
            tabIndex: 0,
            onClick,
            onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }
          }
        : {})}
      className={`flex w-full flex-col gap-[2.06rem] rounded-[0.9375rem] bg-pink-20 px-5 py-[0.94rem] shadow-[0_0_4px_0_rgba(0,0,0,0.10)] ${
        isClickable ? 'cursor-pointer hover:bg-pink-40' : ''
      }`}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-start gap-[0.69rem]">
          <PeriodTag label={isLongTerm ? '장기' : '단기'} />
          <p className="w-full text-left text-heading-sm text-black">
            {productName}
          </p>
        </div>

        {showForwardIcon && <ForwardIcon className="ml-4 shrink-0" />}
      </div>

      <div className="flex flex-col gap-2 text-body-sm text-black">
        <div className="flex flex-row gap-3">
          <p className="border-r-[1.6px] border-gray-60 pr-3">
            {insuranceCompany}
          </p>
          <p>고려 특약 {specialContractCount ?? 0}개</p>
        </div>

        <p>보험 가입 금액: {sumInsured.toLocaleString()}원</p>
        <p>월 예상 보험료: {monthlyCost}</p>
      </div>
    </div>
  );
}
