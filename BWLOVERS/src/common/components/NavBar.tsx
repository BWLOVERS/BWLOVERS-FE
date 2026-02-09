import { useLocation, useNavigate } from 'react-router-dom';

import HomeIcon from '@/assets/common/icon_home.svg?react';
import HomeIconActive from '@/assets/common/icon_home_active.svg?react';
import AboutIcon from '@/assets/common/icon_about.svg?react';
import AboutIconActive from '@/assets/common/icon_about_active.svg?react';
import InsuranceIcon from '@/assets/common/icon_insurance.svg?react';
import InsuranceIconActive from '@/assets/common/icon_insurance_active.svg?react';

type NavKey = 'home' | 'insurance' | 'about';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey: NavKey = location.pathname.startsWith('/insurance')
    ? 'insurance'
    : location.pathname.startsWith('/about')
      ? 'about'
      : 'home';

  const isHomeActive = activeKey === 'home';
  const isInsuranceActive = activeKey === 'insurance';
  const isAboutActive = activeKey === 'about';

  const handleGo = (key: NavKey) => {
    if (key === 'home') navigate('/home');
    if (key === 'insurance') navigate('/insurance');
    if (key === 'about') navigate('/about');
  };

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 flex justify-center">
      <div className="relative w-full max-w-[480px]">
        {/* 가운데 원 버튼 */}
        <button
          type="button"
          aria-label="보험"
          onClick={() => handleGo('insurance')}
          className={`absolute top-0 left-1/2 grid h-18 w-18 -translate-x-1/2 -translate-y-1/3 place-items-center rounded-full shadow-[0_0_4px_rgba(0,0,0,0.25)] ${
            isInsuranceActive ? 'bg-pink-60' : 'bg-white'
          }`}
        >
          <span className="h-8.5 w-8.5">
            {isInsuranceActive ? <InsuranceIconActive /> : <InsuranceIcon />}
          </span>
        </button>

        {/* 내비 바(배경) */}
        <div className="flex h-15.5 w-full items-center justify-between rounded-t-[0.9375rem] bg-white px-14 pt-1 shadow-[0_0_4px_1px_rgba(0,0,0,0.10)]">
          {/* Home */}
          <button
            type="button"
            aria-label="Home"
            onClick={() => handleGo('home')}
            className="flex h-9.25 w-16 flex-col items-center justify-center gap-[0.175rem]"
          >
            <div className="h-[1.32881rem] w-5.75">
              {isHomeActive ? <HomeIconActive /> : <HomeIcon />}
            </div>
            <div
              className={`text-caption-sm ${
                isHomeActive ? 'text-pink-60' : 'text-black'
              }`}
            >
              Home
            </div>
          </button>

          {/* About us */}
          <button
            type="button"
            aria-label="About us"
            onClick={() => handleGo('about')}
            className="flex w-16 flex-col items-center justify-center gap-1.5"
          >
            <div className="h-[1.17188rem] w-[1.43231rem]">
              {isAboutActive ? <AboutIconActive /> : <AboutIcon />}
            </div>
            <div
              className={`text-caption-sm ${
                isAboutActive ? 'text-pink-60' : 'text-black'
              }`}
            >
              About us
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
