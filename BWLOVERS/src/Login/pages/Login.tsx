import LoginBtn from '@/assets/Login/btn_naverlogin.svg?react';
import LogoFull from '@/assets/common/logo_full.svg?react';
import ContactBubble from '../components/ContactBubble';
import { useMemo, useState } from 'react';

function createRandomState() {
  // 브라우저 지원 좋고 간단한 랜덤 state (16바이트)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export default function Login() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID as string;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI as string;

  // authorize URL은 매 렌더마다 바뀌면 안 되므로 useMemo
  const { naverAuthUrl, state } = useMemo(() => {
    const newState = createRandomState();

    const url = new URL('https://nid.naver.com/oauth2.0/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri); // URLSearchParams가 인코딩 처리함
    url.searchParams.set('state', newState);

    return { naverAuthUrl: url.toString(), state: newState };
  }, [clientId, redirectUri]);

  const handleNaverLogin = (e: React.MouseEvent) => {
    e.stopPropagation();

    // ✅ state 저장 (콜백에서 검증용)
    sessionStorage.setItem('naver_oauth_state', state);

    window.location.href = naverAuthUrl;
  };

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

      <LoginBtn
        className="h-13.5 w-59.5 cursor-pointer"
        onClick={handleNaverLogin}
      />

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
