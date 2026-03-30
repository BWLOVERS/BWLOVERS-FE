import { axiosInstance } from '@/apis/axiosInstance';

export type MyReportItemResponse = {
  simulationId: number;
  createdAt: string;
};

export type MyReportListResponse = {
  simulationId: number;
  productName: string;
  createdAt: string;
};

export type MyReportDetailResponse = {
  simulationId: number;
  resultId: string;
  insuranceCompany: string;
  productName: string;
  longTerm: boolean;
  sumInsured: number;
  monthlyCost: string;
  memo: string;
  question: string;
  result: string;
  createdAt: string;
  contracts: Array<{
    contractName: string;
    pageNumber: number;
  }>;
};

export const myreportApi = {
  //홈에서 리스트 조회
  getMyReports: async () => {
    const { data } =
      await axiosInstance.get<MyReportItemResponse[]>('/simulations');
    return data;
  },
  //'더보기' 조회
  getMyReportList: async () => {
    const { data } = await axiosInstance.get<MyReportListResponse[]>(
      '/simulations/details'
    );
    return data;
  },

  //보장 분석 리포트 상세 조회
  getMyReportDetail: async (simulationId: number) => {
    const { data } = await axiosInstance.get<MyReportDetailResponse>(
      `/simulations/${simulationId}`
    );
    return data;
  },

  deleteMyReport: async (simulationId: number) => {
    await axiosInstance.delete(`/simulations/${simulationId}`);
  }
};
