import { axiosInstance } from '@/apis/axiosInstance';

export type RecommendStartResponse = {
  resultId: string;
  expiresInSec: number;
};

export type RecommendListResponse = {
  resultId: string;
  expiresInSec: number;
  items: Array<{
    itemId: string;
    insurance_company: string;
    product_name: string;
    is_long_term: boolean;
    sum_insured: number;
    monthly_cost?: string;
    insurance_recommendation_reason: string;
    special_contracts: Array<{
      contract_name: string;
      contract_description: string;
      contract_recommendation_reason: string;
      key_features: string[];
      page_number: number;
    }>;
    evidence_sources?: Array<{
      page_number: number;
      text_snippet: string;
    }>;
    special_contract_count: number;
  }>;
};

export type RecommendDetailResponse = {
  itemId: string;
  insurance_company: string;
  is_long_term: boolean;
  product_name: string;
  insurance_recommendation_reason: string;
  sum_insured: number;
  monthly_cost?: string;
  special_contracts: Array<{
    contract_name: string;
    contract_description: string;
    contract_recommendation_reason: string;
    key_features: string[];
    page_number: number;
  }>;
  evidence_sources?: Array<{
    page_number: number;
    text_snippet: string;
  }>;
};

export type SaveSelectedInsuranceRequest = {
  resultId: string;
  itemId: string;
  selectedContractNames: string[];
  memo: string;
};

export type SaveSelectedInsuranceResponse = number;

export const recommendApi = {
  postRecommend: async () => {
    const { data } =
      await axiosInstance.post<RecommendStartResponse>('/ai/recommend');
    return data;
  },

  getRecommendList: async (resultId: string) => {
    const { data } = await axiosInstance.get<RecommendListResponse>(
      `/ai/recommend/${resultId}`
    );
    return data;
  },

  getRecommendDetail: async (resultId: string, itemId: string) => {
    const { data } = await axiosInstance.get<RecommendDetailResponse>(
      `/ai/results/${resultId}/items/${itemId}`
    );
    return data;
  },

  saveSelectedInsurance: async (payload: SaveSelectedInsuranceRequest) => {
    const { data } = await axiosInstance.post<SaveSelectedInsuranceResponse>(
      `/insurances/selected`,
      payload
    );
    return data;
  }
};
