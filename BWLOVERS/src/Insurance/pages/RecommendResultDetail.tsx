import { useEffect, useState } from 'react';
import Header from '@/common/components/Header';
import InsuranceCard from '../components/InsuranceCard';
import SpecialContractsSection from '../components/SpecialContractsSection';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SaveResultModal from '../components/SaveResultModal';
import {
  recommendApi,
  type RecommendDetailResponse
} from '@/apis/insurance/recommendApi';
import SingleBtnModal from '@/common/components/SingleBtnModal';

export default function RecommendResultDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resultId = searchParams.get('resultId');
  const itemId = searchParams.get('itemId');

  const [data, setData] = useState<RecommendDetailResponse | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  useEffect(() => {
    if (!resultId || !itemId) {
      window.alert('잘못된 접근입니다.');
      navigate('/insurance', { replace: true });
      return;
    }

    const run = async () => {
      try {
        const res = await recommendApi.getRecommendDetail(resultId, itemId);
        setData(res);
      } catch (e) {
        console.error(e);
        window.alert(
          '상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
        );
        navigate('/insurance', { replace: true });
      }
    };

    run();
  }, [resultId, itemId, navigate]);

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
          <section className="flex flex-col gap-2">
            <div className="text-body-bold-md text-black">
              AI의 보험 추천 이유
            </div>
            <div className="rounded-2xl bg-[#f7f7f7] p-5 text-body-sm text-black">
              {data.insurance_recommendation_reason}
            </div>
          </section>

          <SpecialContractsSection
            contracts={data.special_contracts}
            onSave={() => setSaveModalOpen(true)}
          />
        </div>
      </div>

      <SaveResultModal
        open={saveModalOpen}
        contracts={data.special_contracts.map((c) => ({
          contract_name: c.contract_name
        }))}
        onClose={() => setSaveModalOpen(false)}
        onSave={async ({ selectedContracts, memo }) => {
          const resolvedItemId = itemId ?? data.itemId;

          const selectedContractNames = selectedContracts.map(
            (c) => c.contract_name
          );

          try {
            await recommendApi.saveSelectedInsurance({
              resultId: resultId!,
              itemId: resolvedItemId!,
              selectedContractNames,
              memo
            });

            //저장 성공
            setSaveModalOpen(false);
            setConfirmModalOpen(true);
          } catch (e) {
            setErrorModalOpen(true);
          }
        }}
      />

      <SingleBtnModal
        open={confirmModalOpen}
        title="결과 저장 완료"
        content="저장된 보험은 홈 또는 내가 저장한 보험에서 확인할 수 있습니다."
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          setConfirmModalOpen(false);
        }}
      />
      <SingleBtnModal
        open={errorModalOpen}
        title="저장 실패"
        content="저장에 실패하였습니다. 잠시 후 다시 시도해주세요."
        onClose={() => setErrorModalOpen(false)}
        onConfirm={() => {
          setErrorModalOpen(false);
        }}
      />
    </>
  );
}
