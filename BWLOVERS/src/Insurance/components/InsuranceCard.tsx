import { useNavigate } from 'react-router-dom';
import PeriodTag from './PeriodTag';
import ForwardIcon from '@/assets/Home/icon_forward.svg?react';
import MoreIcon from '@/assets/common/icon_more_vert.svg?react';
import { useEffect, useRef, useState } from 'react';

type InsuranceCardProps = {
  showForwardIcon?: boolean;
  onClick?: () => void;

  productName?: string;
  insuranceCompany?: string;
  isLongTerm?: boolean;
  sumInsured: number;
  monthlyCost?: string;
  specialContractCount?: number;
  memo?: string;
  createdAt?: string;

  // 저장한 보험 조회에서만 확장 기능
  expandable?: boolean;
  specialContractNames?: string[];

  // 아코디언 외부 컨트롤
  isOpen?: boolean;
  onToggle?: () => void;

  // ✅ MyInsuranceList에서만: more 메뉴
  showMoreIcon?: boolean;
  onDelete?: () => void;
};

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 2L10 10L18 2"
        stroke="#B0B0B0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function InsuranceCard({
  showForwardIcon = true,
  onClick,
  productName,
  insuranceCompany,
  isLongTerm,
  sumInsured,
  monthlyCost,
  specialContractCount,
  memo,
  createdAt,

  expandable = false,
  specialContractNames,
  isOpen = false,
  onToggle,

  showMoreIcon = false,
  onDelete
}: InsuranceCardProps) {
  const navigate = useNavigate();

  const isClickable = Boolean(onClick);

  const hasExpandableArea =
    expandable &&
    Array.isArray(specialContractNames) &&
    specialContractNames.length > 0;

  const handleCardClick = () => {
    if (hasExpandableArea) {
      onToggle?.();
      return;
    }
    onClick?.();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    handleCardClick();
  };

  // ✅ More dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isMenuOpen]);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ 카드 클릭(아코디언 토글) 막기
    setIsMenuOpen((prev) => !prev);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete?.();
  };

  return (
    <div className="w-full">
      <div
        {...(isClickable || hasExpandableArea
          ? {
              role: 'button' as const,
              tabIndex: 0,
              onClick: handleCardClick,
              onKeyDown: handleCardKeyDown
            }
          : {})}
        className={`flex w-full flex-col rounded-[0.9375rem] bg-pink-20 px-5 py-[0.94rem] shadow-[0_0_4px_0_rgba(0,0,0,0.10)] ${
          isClickable || hasExpandableArea
            ? 'cursor-pointer hover:bg-pink-40'
            : ''
        } ${hasExpandableArea && isOpen ? 'rounded-b-[0]' : ''}`}
      >
        <div className="flex w-full flex-col">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-start gap-[0.69rem]">
              <PeriodTag label={isLongTerm ? '장기' : '단기'} />
              <p className="w-full text-left text-heading-sm text-black">
                {productName}
              </p>
            </div>

            {/* ✅ 우상단 아이콘 영역 */}
            <div className="relative ml-4 shrink-0" ref={menuRef}>
              {showMoreIcon ? (
                <>
                  <button
                    type="button"
                    onClick={handleMoreClick}
                    className="flex items-center justify-center"
                    aria-label="more menu"
                  >
                    <MoreIcon className="mt-1 h-5 w-5" />
                  </button>

                  {isMenuOpen && (
                    <div
                      className="absolute top-10 right-0 z-50 w-26 rounded-xl bg-white py-2 shadow-[0_4px_10px_rgba(0,0,0,0.12)] hover:bg-gray-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="w-full px-4 py-2 text-left text-body-sm text-black"
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </>
              ) : (
                showForwardIcon && <ForwardIcon />
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div className="mt-[2.06rem] flex flex-col">
              <div className="flex flex-col gap-2 text-body-sm text-black">
                <div className="flex flex-row gap-3">
                  <p className="">{insuranceCompany}</p>
                  {specialContractCount && (
                    <p className="border-l-[1.6px] border-gray-60 pl-3">
                      고려 특약 {specialContractCount ?? 0}개
                    </p>
                  )}
                </div>

                <p>보험 가입 금액: {sumInsured.toLocaleString()}원</p>
                <p>월 예상 보험료: {monthlyCost}</p>

                {createdAt && (
                  <p className="text-body-sm text-gray-60">
                    저장일: {createdAt.slice(0, 10).replaceAll('-', '.')}
                  </p>
                )}
              </div>
            </div>

            {memo && (
              <div className="flex flex-col justify-end">
                <div className="text-body-bold-sm flex shrink-0 justify-end">
                  메모
                </div>
                <div className="mt-2 w-37 rounded-[10px] bg-white p-3 text-body-sm">
                  {memo}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 내가 저장한 보험 페이지에서 사용하는 추가 부분 */}
      {hasExpandableArea && (
        <div
          className={`overflow-hidden rounded-b-[0.9375rem] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.10)] transition-[max-height] duration-300 ease-in-out ${
            isOpen ? 'max-h-125' : 'max-h-0'
          }`}
        >
          <div className="px-5 py-4">
            <div className="flex items-center justify-between text-body-sm text-black">
              <span className="text-body-bold-md">선택 특약</span>
              <button
                onClick={() => navigate('/myinsurance/detail')}
                className="rounded-full bg-gray-10 px-2 text-gray-60"
              >
                자세히 &gt;
              </button>
            </div>

            <ul className="text-gray-90 mt-3 flex flex-col gap-2 text-body-sm">
              {specialContractNames!.map((name, idx) => (
                <li key={`${name}-${idx}`}>{name}</li>
              ))}
            </ul>

            <div className="mt-4 flex w-full justify-center">
              <ChevronDown
                className={`transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
