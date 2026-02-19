import Header from '@/common/components/Header';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import SpecialContractAccordion from '@/Insurance/components/SpecialContractAccordion';
import ActionButton from '@/common/components/ActionButton';
import EditIcon from '@/assets/common/icon_edit.svg?react';
import { useMemo, useState } from 'react';

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
  createdAt: string;
};

export default function MyInsuranceDetail() {
  // ✅ 실제론 API에서 받아온 단건 데이터로 바꾸면 됨
  const data: SavedInsuranceDetail = useMemo(
    () => ({
      insurance_company: '삼성화재',
      product_name:
        '무배당 삼성화재 다이렉트 임산부ㆍ아기보험(해약환급금 미지급형Ⅱ)',
      is_long_term: true,
      sum_insured: 15000,
      monthly_cost: '40,056원',

      insurance_recommendation_reason:
        '임신 23주차로 조산 위험이 있는 상황에서, 임신중독증 진단비와 유산 위로금 특별약관을 통해 추가적인 보장을 받을 수 있습니다.',

      special_contracts: [
        {
          contract_name: '임신중독증 진단비 특별약관',
          contract_description: '약관 기반 맞춤 보장',
          contract_recommendation_reason: '23주차 맞춤 특약',
          key_features: ['보장 범위 확인 완료'],
          page_number: 357
        },
        {
          contract_name: '유산 위로금 특별약관',
          contract_description: '약관 기반 맞춤 보장',
          contract_recommendation_reason: '23주차 맞춤 특약',
          key_features: ['보장 범위 확인 완료'],
          page_number: 412
        }
      ],

      memo: 'ver1.치아특약포함',
      createdAt: '2026-02-11T19:54:25.274782'
    }),
    []
  );

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

  // ✅ 메모 편집 상태
  const [memo, setMemo] = useState<string>(data.memo ?? '');
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoDraft, setMemoDraft] = useState<string>(data.memo ?? '');

  const handleStartEditMemo = () => {
    setIsEditingMemo(true);
    setMemoDraft(memo);
  };

  const handleCancelEditMemo = () => {
    setIsEditingMemo(false);
    setMemoDraft(memo); // draft 롤백
  };

  const handleSaveMemo = async () => {
    const nextMemo = memoDraft;

    // ✅ TODO: API 연결 시 여기서 PATCH/PUT 호출
    // await myInsuranceApi.updateMemo({ ..., memo: nextMemo })

    setMemo(nextMemo);
    setIsEditingMemo(false);
  };

  const isSaveDisabled = memoDraft.trim().length === 0;

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        <Header title="내가 저장한 보험" />
      </div>

      <div className="flex flex-col gap-10 px-[1.7rem] pt-3 pb-10">
        {/* ✅ 저장 상세에서도 카드 클릭 불가 */}
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

          {/* ✅ 메모 + 편집 */}
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
              <div className="rounded-2xl bg-[#f7f7f7] p-5 text-body-sm whitespace-pre-line text-black">
                {memo.trim() ? memo : '-'}
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
