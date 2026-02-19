import type { InsuranceRecommendDetailResponse } from '../types/insurance';

export const recommendDetailDummy: InsuranceRecommendDetailResponse = {
  itemId: 'fd2c17d0',
  insurance_company: '삼성화재',
  is_long_term: true,
  product_name:
    '무배당 삼성화재 다이렉트 임산부ㆍ아기보험(해약환급금 미지급형Ⅱ)',
  insurance_recommendation_reason:
    '임신 23주차로 조산 위험이 있는 상황에서, 임신중독증 진단비와 유산 위로금 특별약관을 통해 추가적인 보장을 받을 수 있습니다.',
  sum_insured: 15000,
  monthly_cost: '40,056원',
  special_contracts: [
    //특약
    {
      contract_name: '임신중독증 진단비 특별약관', //특약 이름
      contract_description:
        '약관 기반 맞춤 보장약관 기반 맞춤 보장약관 기반 맞춤 보장약관 기반 맞춤 보장약관 기반 맞춤 보장약관 기반 맞춤 보장약관 기반 맞춤 보장', //특약 설명
      contract_recommendation_reason: '23주차 맞춤 특약', //특약 추천 이유
      key_features: ['보장 범위 확인 완료'], //특약 주요 특징
      page_number: 357 //보험 문서 해당 페이지
    },
    {
      contract_name: '유산 위로금 특별약관',
      contract_description: '약관 기반 맞춤 보장',
      contract_recommendation_reason: '23주차 맞춤 특약',
      key_features: ['보장 범위 확인 완료'],
      page_number: 357
    },
    {
      contract_name: 'ㅎㅎ',
      contract_description: '약관 기반 맞춤 보장',
      contract_recommendation_reason: '23주차 맞춤 특약',
      key_features: ['보장 범위 확인 완료'],
      page_number: 357
    }
  ],
  evidence_sources: [
    {
      page_number: 357,
      text_snippet:
        "회사는 피보험자가 제5조(특별약관의 보험기간)에서 정한 이 특별약관의 보험기간 중에'임신중독증'으로 진단 확정되었을 때에는 최초 1회에 한하여 보험증권에 기재된 이 특별약관의 보험가입금액을 임신중독증 진단비로 보험수익자에게 지급합니다. (page=356)"
    }
  ]
};
