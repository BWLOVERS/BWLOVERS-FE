import Header from '@/common/components/Header';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import FilterIcon from '@/assets/Insurance/icon_filter.svg?react';
import FilterModal, {
  type FilterValue
} from '@/Insurance/components/FilterModal';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type RecommendItem = {
  itemId: string;
  insurance_company: string;
  product_name: string;
  is_long_term: boolean;
  sum_insured: number;
  monthly_cost?: string;
  special_contract_count: number;
};

type RecommendListResponse = {
  resultId: string;
  expiresInSec: number;
  items: RecommendItem[];
};

type LocationState = {
  result?: RecommendListResponse;
};

export default function RecommendResult() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };

  const result = state?.result;

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modalTop, setModalTop] = useState<number>(0);

  const [filters, setFilters] = useState<FilterValue>({
    insurers: [],
    periods: [],
    maxMonthlyFee: 'all'
  });

  useEffect(() => {
    if (result) return;
    window.alert('추천 결과를 다시 생성해 주세요.');
    navigate('/insurance', { replace: true });
  }, [result, navigate]);

  const chips = useMemo(() => {
    const items: string[] = [];

    filters.insurers.forEach((insurer) => {
      items.push(insurer);
    });

    filters.periods.forEach((p) => {
      items.push(p === 'long' ? '장기' : '단기');
    });

    if (filters.maxMonthlyFee !== 'all') {
      items.push(`월 ${filters.maxMonthlyFee.toLocaleString()}원 이하`);
    }

    return items;
  }, [filters]);

  const computeModalTop = () => {
    const el = buttonRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.round(rect.bottom + 10);
  };

  const handleToggleFilter = () => {
    if (isFilterOpen) {
      setIsFilterOpen(false);
      return;
    }
    setModalTop(computeModalTop());
    setIsFilterOpen(true);
  };

  useEffect(() => {
    if (!isFilterOpen) return;

    const handleResizeOrScroll = () => {
      setModalTop(computeModalTop());
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [isFilterOpen]);

  const handleGoDetail = (itemId: string) => {
    if (!result) return null;
    navigate(
      `/insurance/recommend/result/detail?resultId=${result.resultId}&itemId=${itemId}`
    );
  };
  if (!result) return null;

  return (
    <>
      <div className="sticky top-0 z-50 bg-linear-to-b from-white from-92% to-transparent">
        <Header title="추천 결과" />
        <div className="mb-4 flex flex-row items-start gap-2 px-[1.7rem]">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleToggleFilter}
            className="relative z-120 flex shrink-0 flex-row items-center gap-1 rounded-lg border border-gray-20 bg-white px-2 py-1 text-body-sm text-black hover:bg-gray-20"
          >
            <FilterIcon className="h-3.5 w-3.5" />
            필터 설정
          </button>

          <FilterModal
            open={isFilterOpen}
            top={modalTop}
            value={filters}
            onClose={() => setIsFilterOpen(false)}
            onApply={(next) => setFilters(next)}
          />

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {chips.length > 0 &&
              chips.map((chip) => (
                <div
                  key={chip}
                  className="rounded-full bg-gray-20 px-3 py-[0.2rem] text-body-sm text-gray-80"
                >
                  {chip}
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="px-[1.7rem] py-3">
        <div className="mb-8 flex flex-col gap-4">
          {result.items.map((item) => (
            <InsuranceCard
              key={item.itemId}
              showForwardIcon
              onClick={() => handleGoDetail(item.itemId)}
              productName={item.product_name}
              insuranceCompany={item.insurance_company}
              isLongTerm={item.is_long_term}
              sumInsured={item.sum_insured}
              monthlyCost={item.monthly_cost}
              specialContractCount={item.special_contract_count}
            />
          ))}
        </div>
      </div>
    </>
  );
}
