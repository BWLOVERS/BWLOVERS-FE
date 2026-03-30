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
  is_long_term: boolean;
  sum_insured: number;
  monthly_cost: string;
  memo: string;
  special_contracts: Array<{
    contract_name: string;
    page_number: number;
  }>;
  question: string;
  result: string;
};

export type SaveSimulationResultRequest = {
  resultId: string;
};

export type SaveSimulationResultResponse = {
  simulationId: number;
  resultId: string;
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
  },

  saveSimulationResult: async (resultId: string) => {
    const { data } = await axiosInstance.post<SaveSimulationResultResponse>(
      '/simulations/save',
      { resultId } satisfies SaveSimulationResultRequest
    );
    return data;
  }
};
