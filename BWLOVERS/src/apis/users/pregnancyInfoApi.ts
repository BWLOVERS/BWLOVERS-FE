import { axiosInstance } from '@/apis/axiosInstance';
import type {
  PregnancyInfoDraft,
  PregnancyInfoResponse
} from '@/SignUp/stores/pregnancyInfoStore';
import { mapDraftToPregnancyInfoRequest } from '@/SignUp/utils/pregnancyInfoMapper';

export type PregnancyInfoUpsertRequest = ReturnType<
  typeof mapDraftToPregnancyInfoRequest
>;

export const pregnancyInfoApi = {
  async postPregnancyInfo(draft: PregnancyInfoDraft) {
    const body = mapDraftToPregnancyInfoRequest(draft);
    const { data } = await axiosInstance.post<PregnancyInfoResponse>(
      '/users/me/pregnancy-info',
      body
    );
    return data;
  },

  async getPregnancyInfo() {
    const { data } = await axiosInstance.get<PregnancyInfoResponse>(
      '/users/me/pregnancy-info'
    );
    return data;
  },

  async patchPregnancyInfo(draft: PregnancyInfoDraft) {
    const body = mapDraftToPregnancyInfoRequest(draft);
    const { data } = await axiosInstance.patch<PregnancyInfoResponse>(
      '/users/me/pregnancy-info',
      body
    );
    return data;
  }
};
