import { useState } from 'react';
import Header from '@/common/components/Header';
import InsuranceCard from '../components/InsuranceCard';
import SpecialContractsSection from '../components/SpecialContractsSection';
import { useSearchParams } from 'react-router-dom';
import { recommendDetailDummy } from '../mocks/RecommendDetailDummy';
import SaveResultModal from '../components/SaveResultModal';

export default function RecommendResultDetail() {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('itemId'); // api 연결 시 사용

  const data = recommendDetailDummy;
  const [open, setOpen] = useState(false);

  if (!data) return null;

  return (
    <>
      <div className="sticky top-0 z-50 bg-white">
        <Header title="결과 상세" />
      </div>

      <div className="flex flex-col gap-10 px-[1.7rem] pt-3 pb-10">
        <InsuranceCard
          showForwardIcon={false}
          productName={data.product_name}
          insuranceCompany={data.insurance_company}
          isLongTerm={data.is_long_term}
          sumInsured={data.sum_insured}
          monthlyCost={data.monthly_cost}
          specialContractCount={data.special_contracts?.length ?? 0}
        />

        <div className="flex flex-col gap-10">
          {/* AI 추천 이유 */}
          <section className="flex flex-col gap-2">
            <div className="text-body-bold-md text-black">
              AI의 보험 추천 이유
            </div>
            <div className="rounded-2xl bg-[#f7f7f7] p-5 text-body-sm text-black">
              {data.insurance_recommendation_reason}
            </div>
          </section>

          {/* 고려 특약 */}
          <SpecialContractsSection
            contracts={data.special_contracts}
            onSave={() => setOpen(true)} // ✅ 여기서 모달 열기
          />
        </div>
      </div>

      <SaveResultModal
        open={open}
        contracts={data.special_contracts.map((c) => ({
          contract_name: c.contract_name
        }))}
        onClose={() => setOpen(false)}
        onSave={({ selectedContracts, memo }) => {
          console.log(selectedContracts, memo);
        }}
      />
    </>
  );
}
