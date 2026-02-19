import { axiosInstance } from '@/apis/axiosInstance';
import type {
  PregnancyInfoDraft,
  PregnancyInfoResponse
} from '@/stores/pregnancyInfoStore';
import { mapDraftToPregnancyInfoRequest } from '@/SignUp/utils/pregnancyInfoMapper';

export const pregnancyInfoApi = {
  async postPregnancyInfo(draft: PregnancyInfoDraft) {
    const body = mapDraftToPregnancyInfoRequest(draft);
    const { data } = await axiosInstance.post<PregnancyInfoResponse>(
      '/users/me/pregnancy-info',
      body
    );
    return data;
  }
};
