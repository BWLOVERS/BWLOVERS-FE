import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { ocrApi } from '@/apis/ocr/ocrApi';

export default function ExplainLoading() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { jobId?: string } };
  const jobId = location.state?.jobId;

  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!jobId) {
      window.alert('잘못된 접근입니다.');
      navigate(-1);
      return;
    }

    stoppedRef.current = false;

    const poll = async () => {
      try {
        const data = await ocrApi.getJob(jobId);
        if (stoppedRef.current) return;

        if (data.status === 'DONE') {
          navigate('/insurance/explain/result', {
            replace: true,
            state: { response: data }
          });
          return;
        }

        if (data.status === 'FAILED') {
          window.alert(data.error ?? '분석에 실패했습니다.');
          navigate(-1);
          return;
        }

        setTimeout(poll, 1200);
      } catch (e) {
        console.error(e);
        setTimeout(poll, 2000);
      }
    };

    poll();

    return () => {
      stoppedRef.current = true;
    };
  }, [jobId, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Loading />
    </div>
  );
}
