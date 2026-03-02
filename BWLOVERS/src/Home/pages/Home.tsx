import NavBar from '@/common/components/NavBar';
import Logo from '@/assets/common/logo_title.svg?react';
import HomeBackgroundWide from '@/assets/Home/bg_home_wide3.svg?react';
import ForwardIcon from '@/assets/Home/icon_forward.svg?react';
import HomeProfileImg from '../components/HomeProfileImg';
import SavedInsurance from '../components/SavedInsurance';
import SavedReport from '../components/SavedReport';
import HomeMenuItem from '../components/HomeMenuItem';
import { useNavigate } from 'react-router-dom';
import { useUserAccountStore } from '@/SignUp/stores/userAccountStore';
import { useEffect, useState } from 'react';
import DoubleBtnModal from '@/common/components/DoubleBtnModal';
import { tokenStorage } from '@/apis/auth/tokenStorage';
import { authApi } from '@/apis/auth/authApi';
import {
  insurancesApi,
  type InsuranceListItem
} from '@/apis/insurance/insurancesApi';

export default function Home() {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { me, fetchMe, logout } = useUserAccountStore();
  const [myInsurances, setMyInsurances] = useState<InsuranceListItem[]>([]);
  const [isLoadingInsurances, setIsLoadingInsurances] = useState(false);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        setIsLoadingInsurances(true);
        const list = await insurancesApi.getMyInsurances();

        // 최신순 정렬 원하면
        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setMyInsurances(sorted);
      } catch (e) {
        console.error('getMyInsurances failed:', e);
        window.alert(
          '보험 리스트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
        );
      } finally {
        setIsLoadingInsurances(false);
      }
    };

    fetchInsurances();
  }, []);

  useEffect(() => {
    if (!me) fetchMe();
  }, [me, fetchMe]);

  const username = me?.username;
  const profileImage = me?.profileImage ?? null;

  return (
    <>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Logo className="z-10 mt-[1.56rem] ml-6 h-4.75 w-[5.0825rem] shrink-0" />
        <HomeBackgroundWide className="absolute top-0 left-1/2 -translate-x-1/2" />
        <div className="z-10 mx-9 mt-13 flex flex-row items-center justify-between">
          <div className="text-heading-lg text-black">
            안녕하세요,
            <br /> {username} 님!
          </div>
          <div className="flex gap-3">
            <HomeProfileImg imageUrl={profileImage} />
            <button onClick={() => navigate('/profile/edit')}>
              <ForwardIcon className="h-8 w-8 rounded-full hover:bg-gray-20" />
            </button>
          </div>
        </div>

        <div className="mx-[1.81rem] mt-24 flex flex-col gap-4.75">
          <div className="flex flex-row items-center justify-between">
            <div className="text-heading-sm text-black">내가 저장한 보험</div>
            <div
              onClick={() => navigate('/myinsurance')}
              className="flex flex-row items-center rounded-full pl-2 text-body-xs text-gray-80 hover:bg-gray-10"
            >
              더보기
              <ForwardIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="flex flex-row gap-[0.56rem] overflow-x-scroll">
            {isLoadingInsurances ? (
              <div className="text-body-sm text-gray-60">불러오는 중...</div>
            ) : myInsurances.length === 0 ? (
              <div className="text-body-sm text-gray-60">
                저장한 보험이 없습니다.
              </div>
            ) : (
              myInsurances.map((item) => (
                <SavedInsurance
                  key={item.insuranceId}
                  insuranceId={item.insuranceId}
                  insuranceCompany={item.insuranceCompany}
                  productName={item.productName}
                  createdAt={item.createdAt}
                />
              ))
            )}
          </div>
        </div>

        <div className="mx-[1.81rem] mt-[2.44rem] flex flex-col gap-4.75">
          <div className="text-heading-sm text-black">
            저장한 보장 분석 리포트
          </div>
          <div className="flex flex-row gap-[0.56rem] overflow-x-scroll">
            <SavedReport />
            <SavedReport />
            <SavedReport />
            <SavedReport />
            <SavedReport />
            <SavedReport />
          </div>
        </div>

        <div className="mx-5 my-[1.44rem] h-px bg-gray-20" />

        <div className="mx-[1.185rem] mb-24 flex flex-col gap-[0.88rem]">
          <div className="ml-2.5 text-heading-sm text-black">기타</div>
          <div>
            <HomeMenuItem label="문의하기" />
            <HomeMenuItem
              label="로그아웃"
              onClick={() => setIsLogoutModalOpen(true)}
            />
            <HomeMenuItem
              label="탈퇴하기"
              onClick={() => setIsWithdrawModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <NavBar />

      <DoubleBtnModal
        open={isLogoutModalOpen}
        title="로그아웃 하시겠습니까?"
        cancelLabel="아니오"
        confirmLabel="예"
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          tokenStorage.clear();
          logout();
          setIsLogoutModalOpen(false);
          navigate('/');
        }}
      />

      <DoubleBtnModal
        open={isWithdrawModalOpen}
        title="정말 탈퇴 하시겠습니까?"
        content="탈퇴 후엔 모든 정보가 삭제됩니다."
        cancelLabel="취소"
        confirmLabel="예"
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={() => {
          setIsWithdrawModalOpen(false);
          setIsConfirmModalOpen(true);
        }}
      />

      <DoubleBtnModal
        open={isConfirmModalOpen}
        title="탈퇴 의사 최종 확인"
        content={`탈퇴 시 모든 정보가 삭제되며, \n복구할 수 없습니다.\n ⚠️ 입력 제출 시 탈퇴가 완료 됩니다.`}
        cancelLabel="취소"
        confirmLabel="확인"
        requireConfirmText
        confirmText="확인했습니다."
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={async () => {
          try {
            await authApi.withdraw();

            //성공 후 토큰/상태 정리
            tokenStorage.clear();
            logout();

            // 모달 닫고 이동
            setIsConfirmModalOpen(false);
            window.location.replace('/');
          } catch (e) {
            console.error('withdraw failed:', e);
            window.alert(
              '시스템 오류가 발생했습니다. \n 잠시 후 다시 시도해주세요.'
            );
          }
        }}
      />
    </>
  );
}
