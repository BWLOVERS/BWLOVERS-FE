// CoverageLoading.tsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { coverageApi } from '@/apis/insurance/coverageApi';
import type { CoverageSimulateResultResponse } from '@/apis/insurance/coverageApi';
import Loading from './Loading';

type LoadingState = {
  insuranceId: number;
  selectedContractIds: number[];
  selectedContractNames: string[];
  question: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function CoverageLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const state = location.state as LoadingState | null;

    if (!state) {
      navigate('/insurance/coverage', { replace: true });
      return;
    }

    const run = async () => {
      try {
        // 1) POST
        const start = await coverageApi.startSimulation({
          insuranceId: state.insuranceId,
          selectedContractIds: state.selectedContractIds,
          question: state.question
        });

        // 2) GET (폴링)
        let result: CoverageSimulateResultResponse | null = null;

        for (let i = 0; i < 5; i++) {
          //get i번 시도 반복
          try {
            const data = await coverageApi.getSimulationResult(start.resultId);

            if (data?.result && data.result.trim().length > 0) {
              result = data;
              break;
            }
          } catch {
            // 준비 전이면 무시하고 재시도
          }
          await sleep(1000);
        }

        if (!result) {
          window.alert(
            '시뮬레이션 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
          );
          navigate('/insurance/coverage', { replace: true });
          return;
        }

        // ✅ 3) Result로 이동 (URL에 resultId 포함)
        //    state는 UI 표시용(선택 특약/상황)을 위해 "옵션"으로 같이 넘겨두면 좋음
        navigate(`/insurance/coverage/result/${result.resultId}`, {
          replace: true,
          state: {
            selectedContractNames: state.selectedContractNames,
            situation: state.question
          }
        });
      } catch (e) {
        console.error(e);
        window.alert('시뮬레이션 요청 중 오류가 발생했습니다.');
        navigate('/insurance/coverage', { replace: true });
      }
    };

    run();
  }, [location.state, navigate]);

  return <Loading />;
}
