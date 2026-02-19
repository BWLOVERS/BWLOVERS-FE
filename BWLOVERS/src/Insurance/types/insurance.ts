export interface SpecialContract {
  contract_name: string;
  contract_description: string;
  contract_recommendation_reason: string;
  key_features: string[];
  page_number: number;
}

export interface EvidenceSource {
  page_number: number;
  text_snippet: string;
}

/** 상세 조회에서 내려오는 보험 1개(기본형) */
export interface InsuranceItem {
  itemId: string;
  insurance_company: string;
  is_long_term: boolean;
  product_name: string;
  insurance_recommendation_reason: string;
  sum_insured: number;
  monthly_cost: string;

  special_contracts: SpecialContract[];
  evidence_sources: EvidenceSource[];
}

/** 리스트 조회에서 내려오는 보험 1개(확장형) */
export interface InsuranceListItem extends InsuranceItem {
  special_contract_count: number;
}

/** 리스트 API 응답 */
export interface InsuranceRecommendListResponse {
  resultId: string;
  expiresInSec: number;
  items: InsuranceListItem[];
}

/** 상세 API 응답 (지금 예시처럼 item 단독으로 내려오면 이 타입) */
export type InsuranceRecommendDetailResponse = InsuranceItem;
