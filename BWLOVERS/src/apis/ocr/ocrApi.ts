import { axiosInstance } from '@/apis/axiosInstance';

export type OcrJobStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUMMARIZING'
  | 'DONE'
  | 'FAILED';

export type OcrResult = {
  oneLineSummary: string;
  easyExplanation: string;
  importantPoints: string[];
  warnings: string[];
  terms: { term: string; meaning: string }[];
};

export type OcrJobResponse = {
  jobId: string;
  status: OcrJobStatus;
  progress?: {
    donePages: number;
    totalPages: number;
  };
  result: OcrResult | null;
  error: string | null;
};

export type OcrJobCreateResponse = {
  jobId: string;
  status: OcrJobStatus;
};

export const ocrApi = {
  createJob: async (images: File[]) => {
    const formData = new FormData();
    images.forEach((file) => formData.append('images', file));

    const { data } = await axiosInstance.post<OcrJobCreateResponse>(
      '/ocr/jobs',
      formData,
      {
        headers: {
          'Content-Type': undefined
        }
      }
    );

    return data;
  },

  getJob: async (jobId: string) => {
    const { data } = await axiosInstance.get<OcrJobResponse>(
      `/ocr/jobs/${jobId}`
    );
    return data;
  }
};
