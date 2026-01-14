import LoginBtn from '@/assets/Login/btn_naverlogin.svg?react';
import LogoFull from '@/assets/common/logo_full.svg?react';

export default function Login() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mb-34">
        <LogoFull className="mb-2 h-[8.94081rem] w-53.75" />
        <div className="flex h-7.25 justify-center text-heading-sm text-[#000000]">
          태아보험, 이젠 더 쉽게!
        </div>
      </div>
      <LoginBtn className="h-13.5 w-59.5 cursor-pointer" />
      <div className="mt-5 cursor-pointer text-caption-md text-gray-60">
        문의하기
      </div>
    </div>
  );
}
