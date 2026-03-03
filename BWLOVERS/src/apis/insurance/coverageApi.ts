import { axiosInstance } from '@/apis/axiosInstance';

export type CoverageSimulateRequest = {
  insuranceId: number;
  selectedContractIds: number[];
  question: string;
};

export type CoverageSimulateStartResponse = {
  resultId: string;
};

export type CoverageSimulateResultResponse = {
  resultId: string;
  insurance_company: string;
  product_name: string;
  special_contracts: Array<{
    contract_name: string;
    page_number: number;
  }>;
  question: string;
  result: string;
};

export const coverageApi = {
  startSimulation: async (payload: CoverageSimulateRequest) => {
    const { data } = await axiosInstance.post<CoverageSimulateStartResponse>(
      '/ai/simulation',
      payload
    );
    return data;
  },

  getSimulationResult: async (resultId: string) => {
    const { data } = await axiosInstance.get<CoverageSimulateResultResponse>(
      `/ai/simulation/${resultId}`
    );
    return data;
  }
};
