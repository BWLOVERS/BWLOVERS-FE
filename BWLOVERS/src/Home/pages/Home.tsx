import NavBar from '@/common/components/NavBar';
import Logo from '@/assets/common/logo_title.svg?react';
import HomeBackgroundWide from '@/assets/Home/bg_home_wide3.svg?react';
import ForwardIcon from '@/assets/Home/icon_forward.svg?react';
import HomeProfileImg from '../components/HomeProfileImg';
import SavedInsurance from '../components/SavedInsurance';
import SavedReport from '../components/SavedReport';
import HomeMenuItem from '../components/HomeMenuItem';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Home() {
  const user = '봉원이지롱';
  const navigate = useNavigate();

  return (
    <>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Logo className="z-10 mt-[1.56rem] ml-6 h-4.75 w-[5.0825rem] shrink-0" />
        <HomeBackgroundWide className="absolute top-0 left-1/2 -translate-x-1/2" />
        <div className="z-10 mx-9 mt-13 flex flex-row items-center justify-between">
          <div className="text-heading-lg text-black">
            안녕하세요,
            <br /> {user} 님!
          </div>
          <div className="flex gap-3">
            <HomeProfileImg />
            <button onClick={() => navigate('/profile/edit')}>
              <ForwardIcon className="h-8 w-8 rounded-full hover:bg-gray-20" />
            </button>
          </div>
        </div>

        <div className="mx-[1.81rem] mt-24 flex flex-col gap-4.75">
          <div className="flex flex-row items-center justify-between">
            <div className="text-heading-sm text-black">내가 저장한 보험</div>
            <div className="flex flex-row items-center rounded-full pl-2 text-body-xs text-gray-80 hover:bg-gray-10">
              더보기
              <ForwardIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="flex flex-row gap-[0.56rem] overflow-x-scroll">
            <SavedInsurance />
            <SavedInsurance />
            <SavedInsurance />
            <SavedInsurance />
            <SavedInsurance />
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

        <div className="mx-5 my-[1.44rem] h-[0.0625rem] bg-gray-20" />

        <div className="mx-[1.185rem] mb-24 flex flex-col gap-[0.88rem]">
          <div className="ml-2.5 text-heading-sm text-black">기타</div>
          <div>
            <HomeMenuItem label="문의하기" />
            <HomeMenuItem label="로그아웃" />
            <HomeMenuItem label="탈퇴하기" />
          </div>
        </div>
      </div>

      <NavBar />
    </>
  );
}
