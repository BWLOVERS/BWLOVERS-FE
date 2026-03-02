import { axiosInstance } from '@/apis/axiosInstance';

export type InsuranceListItem = {
  insuranceId: number;
  insuranceCompany: string;
  productName: string;
  createdAt: string;
};

export type InsuranceDetailListItem = {
  insuranceId: number;
  insuranceCompany: string;
  productName: string;
  sumInsured: number;
  monthlyCost?: string;
  memo?: string;
  createdAt: string;
  specialContracts: { contractId: number; contractName: string }[];
  longTerm: boolean;
};

export type InsuranceDetailResponse = {
  insuranceId: number;
  resultId: string;
  itemId: string;
  insuranceCompany: string;
  productName: string;
  sumInsured: number;
  monthlyCost?: string;
  insuranceRecommendationReason: string;
  memo?: string;
  specialContracts: {
    contractId: number;
    contractName: string;
    contractDescription: string;
    contractRecommendationReason: string;
    keyFeatures: string[];
    pageNumber: number;
  }[];
  longTerm: boolean;
  createdAt: string;
};

export const insurancesApi = {
  //저장한 보험 리스트(홈) 조회
  getMyInsurances: async () => {
    const { data } =
      await axiosInstance.get<InsuranceListItem[]>('/insurances');
    return data;
  },

  //저장한 보험 리스트 조회
  getMyInsuranceList: async () => {
    const { data } = await axiosInstance.get<InsuranceDetailListItem[]>(
      '/insurances/details'
    );
    return data;
  },

  //단건 상세 조회
  getMyInsuranceDetail: async (insuranceId: number) => {
    const { data } = await axiosInstance.get<InsuranceDetailResponse>(
      `/insurances/${insuranceId}`
    );
    return data;
  },

  deleteInsurance: async (insuranceId: number) => {
    await axiosInstance.delete(`/insurances/${insuranceId}`);
  },

  updateInsuranceMemo: async (insuranceId: number, memo: string) => {
    const { data } = await axiosInstance.patch<{ memo: string }>(
      `/insurances/${insuranceId}/memo`,
      { memo }
    );
    return data;
  }
};
