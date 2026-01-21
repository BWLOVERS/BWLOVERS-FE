import LoginBtn from '@/assets/Login/btn_naverlogin.svg?react';
import LogoFull from '@/assets/common/logo_full.svg?react';
import ContactBubble from '../components/contactBubble';

import { useState } from 'react';

export default function Login() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center"
      onClick={() => setIsContactOpen(false)}
    >
      <div className="mb-34">
        <LogoFull className="mb-2 h-[8.94081rem] w-53.75" />
        <div className="flex h-7.25 justify-center text-heading-sm text-[#000000]">
          태아보험, 이젠 더 쉽게!
        </div>
      </div>
      <LoginBtn className="h-13.5 w-59.5 cursor-pointer" />
      <div className="relative">
        <div
          className={`${isContactOpen ? 'text-black' : 'text-gray-60'} mt-5 cursor-pointer text-caption-md transition hover:text-pink-80`}
          onClick={(e) => {
            e.stopPropagation();
            setIsContactOpen((prev) => !prev);
          }}
        >
          문의하기
        </div>

        {isContactOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-1/2 mt-7 -translate-x-1/2"
          >
            <ContactBubble />
          </div>
        )}
      </div>
    </div>
  );
}
