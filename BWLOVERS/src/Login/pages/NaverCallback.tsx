import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/apis/auth/authApi';
import { tokenStorage } from '@/apis/auth/tokenStorage';

export default function NaverCallback() {
  const navigate = useNavigate();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      const errorDescription = url.searchParams.get('error_description');

      if (error) {
        console.error('Naver OAuth error:', error, errorDescription);
        navigate('/', { replace: true });
        return;
      }

      if (!code || !state) {
        console.error('Missing code/state');
        navigate('/', { replace: true });
        return;
      }

      // ✅ state 검증
      const storedState = sessionStorage.getItem('naver_oauth_state');
      if (!storedState || storedState !== state) {
        console.error('Invalid state', { storedState, state });
        navigate('/', { replace: true });
        return;
      }
      sessionStorage.removeItem('naver_oauth_state');

      try {
        const { accessToken, refreshToken } = await authApi.loginWithNaver({
          code,
          state
        });

        tokenStorage.set(accessToken, refreshToken);

        // 임시: 가입 플로우로
        navigate('/signup/account', { replace: true });
      } catch (e) {
        console.error(e);
        navigate('/', { replace: true });
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="flex flex-1 items-center justify-center">
      로그인 처리 중...
    </div>
  );
}
