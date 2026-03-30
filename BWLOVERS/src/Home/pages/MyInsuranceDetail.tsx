import Header from '@/common/components/Header';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import SpecialContractAccordion from '@/Insurance/components/SpecialContractAccordion';
import ActionButton from '@/common/components/ActionButton';
import EditIcon from '@/assets/common/icon_edit.svg?react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  insurancesApi,
  type InsuranceDetailResponse
} from '@/apis/insurance/insurancesApi';

type SpecialContract = {
  contract_name: string;
  contract_description: string;
  contract_recommendation_reason: string;
  key_features: string[];
  page_number: number;
};

type SavedInsuranceDetail = {
  insurance_company: string;
  product_name: string;
  is_long_term: boolean;
  sum_insured: number;
  monthly_cost?: string;
  special_contracts: SpecialContract[];
  insurance_recommendation_reason: string;
  memo?: string;
  createdAt?: string;
};

export default function MyInsuranceDetail() {
  const { insuranceId } = useParams<{ insuranceId: string }>();

  const [data, setData] = useState<SavedInsuranceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => new Set());

  const handleToggle = (idx: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  //  메모 편집 상태 (data 로드 후 세팅)
  const [memo, setMemo] = useState<string>('');
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoDraft, setMemoDraft] = useState<string>('');

  //단건 상세 조회
  useEffect(() => {
    const id = Number(insuranceId);
    if (!insuranceId || Number.isNaN(id)) {
      window.alert('잘못된 접근입니다.');
      return;
    }

    const fetchDetail = async () => {
      try {
        setIsLoading(true);

        const res: InsuranceDetailResponse =
          await insurancesApi.getMyInsuranceDetail(id);

        const mapped: SavedInsuranceDetail = {
          insurance_company: res.insuranceCompany,
          product_name: res.productName,
          is_long_term: res.longTerm,
          sum_insured: res.sumInsured,
          monthly_cost: res.monthlyCost,
          insurance_recommendation_reason: res.insuranceRecommendationReason,
          memo: res.memo ?? '',
          special_contracts: (res.specialContracts ?? []).map((c) => ({
            contract_name: c.contractName,
            contract_description: c.contractDescription,
            contract_recommendation_reason: c.contractRecommendationReason,
            key_features: c.keyFeatures ?? [],
            page_number: c.pageNumber
          })),
          createdAt: res.createdAt
        };

        setData(mapped);

        // 메모 상태 초기화(로드 후)
        setMemo(mapped.memo ?? '');
        setMemoDraft(mapped.memo ?? '');
      } catch (e) {
        console.error('getMyInsuranceDetail failed:', e);
        window.alert(
          '보험 상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [insuranceId]);

  const handleStartEditMemo = () => {
    setIsEditingMemo(true);
    setMemoDraft(memo);
  };

  const handleCancelEditMemo = () => {
    setIsEditingMemo(false);
    setMemoDraft(memo);
  };

  const handleSaveMemo = async () => {
    const id = Number(insuranceId);
    if (Number.isNaN(id)) return;

    const nextMemo = memoDraft;

    try {
      const { memo: savedMemo } = await insurancesApi.updateInsuranceMemo(
        id,
        nextMemo
      );

      setMemo(savedMemo);
      setMemoDraft(savedMemo);
      setIsEditingMemo(false);

      setData((prev) => (prev ? { ...prev, memo: savedMemo } : prev));
    } catch (e) {
      console.error('updateInsuranceMemo failed:', e);
      window.alert('메모 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const isSaveDisabled = memoDraft === memo;

  //  로딩/빈 데이터 처리
  if (isLoading || !data) {
    return (
      <>
        <div className="sticky top-0 z-50 bg-white">
          <Header title="내가 저장한 보험" />
        </div>
        <div className="px-[1.7rem] pt-6 text-body-sm text-gray-60">
          불러오는 중...
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        <Header title="내가 저장한 보험" />
      </div>

      <div className="flex flex-col gap-10 px-[1.7rem] pt-3 pb-10">
        {/*  저장 상세에서도 카드 클릭 불가 */}
        <InsuranceCard
          showForwardIcon={false}
          productName={data.product_name}
          insuranceCompany={data.insurance_company}
          isLongTerm={data.is_long_term}
          sumInsured={data.sum_insured}
          monthlyCost={data.monthly_cost}
          specialContractCount={data.special_contracts?.length ?? 0}
          createdAt={data.createdAt}
        />

        <div className="flex flex-col gap-10">
          {/* 추천 이유 */}
          <section className="flex flex-col gap-2">
            <div className="text-body-bold-md text-black">
              AI의 보험 추천 이유
            </div>
            <div className="rounded-2xl bg-[#f7f7f7] p-5 text-body-sm text-black">
              {data.insurance_recommendation_reason}
            </div>
          </section>

          {/* 특약 */}
          <section className="flex flex-col gap-3">
            <div className="text-body-bold-md text-black">
              고려하면 좋을 특약
            </div>

            <div className="flex flex-col gap-3">
              {data.special_contracts.map((c, idx) => (
                <SpecialContractAccordion
                  key={`${c.contract_name}-${idx}`}
                  contract={c}
                  isOpen={openIndexes.has(idx)}
                  onToggle={() => handleToggle(idx)}
                />
              ))}
            </div>
          </section>

          {/*  메모 + 편집 */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-body-bold-md text-black">메모</div>

              {!isEditingMemo && (
                <button
                  type="button"
                  onClick={handleStartEditMemo}
                  className="flex flex-row items-center gap-1 rounded-full px-2 text-body-sm text-gray-80 hover:bg-gray-10"
                >
                  <EditIcon className="h-4 w-4" />
                  편집
                </button>
              )}
            </div>

            {/* 보기 모드 */}
            {!isEditingMemo && (
              <div
                className={`rounded-2xl bg-[#f7f7f7] p-5 text-body-sm whitespace-pre-line ${memo.trim() ? 'text-black' : 'text-gray-40'}`}
              >
                {memo.trim() ? memo : '저장한 메모가 없습니다'}
              </div>
            )}

            {/* 편집 모드 */}
            {isEditingMemo && (
              <div className="flex flex-col gap-6">
                <textarea
                  value={memoDraft}
                  onChange={(e) => setMemoDraft(e.target.value)}
                  rows={3}
                  className="border-gray-30 w-full resize-none rounded-2xl border bg-white p-5 text-body-sm text-black outline-none focus:border-gray-60"
                  placeholder="메모를 입력하세요"
                />

                <div className="flex w-full justify-end gap-4">
                  <ActionButton
                    label="취소"
                    variant="secondary"
                    onClick={handleCancelEditMemo}
                  />
                  <ActionButton
                    label="저장"
                    variant="primary"
                    onClick={handleSaveMemo}
                    disabled={isSaveDisabled}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
