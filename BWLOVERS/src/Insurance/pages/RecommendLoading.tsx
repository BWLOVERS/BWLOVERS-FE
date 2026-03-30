import Loading from './Loading';
import { recommendApi } from '@/apis/insurance/recommendApi';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecommendLoading() {
  const navigate = useNavigate();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const run = async () => {
      try {
        const startRes = await recommendApi.postRecommend();
        const { resultId } = startRes;
        const MAX_TRY = 30;
        const INTERVAL_MS = 1000;

        for (let i = 0; i < MAX_TRY; i += 1) {
          try {
            const listRes = await recommendApi.getRecommendList(resultId);
            console.log(listRes);
            if (listRes?.items && listRes.items.length > 0) {
              navigate('/insurance/recommend/result', {
                replace: true,
                state: { result: listRes }
              });
              return;
            }
          } catch (e) {}

          await sleep(INTERVAL_MS);
        }

        // 제한 시간 초과
        window.alert('추천 생성 시간이 초과되었습니다. 다시 시도해 주세요.');
        navigate('/insurance', { replace: true });
      } catch (e) {
        console.error(e);
        window.alert('시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        navigate('/insurance', { replace: true });
      }
    };

    run();
  }, [navigate]);

  return <Loading />;
}
