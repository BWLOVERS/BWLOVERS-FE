import WaveBackground from '@/assets/Insurance/bg_wave_wide.svg?react';
import NextIcon from '@/assets/Insurance/icon_arrow_next.svg?react';
import { useNavigate } from 'react-router-dom';

export default function EducationTab() {
  const navigate = useNavigate();

  return (
    <section className="relative flex-1 overflow-hidden pb-24">
      <div className="relative flex h-15 bg-pink-20">
        <WaveBackground className="absolute top-15 left-0" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-30">
        <div className="flex flex-col items-start gap-8 text-black">
          <div className="text-heading-md">보험 이해 서비스</div>
          <div className="text-heading-sm">
            이미 가지고 있는 보험 계약 서류 중<br />
            어려운 내용이 있다면?
            <br />
            <br />
            보험 이해 서비스에서 제공하는 <br />
            내용 요약과 용어 풀이를 활용해보세요.
          </div>
        </div>
        <div className="flex flex-col gap-15">
          <div className="text-heading-sm text-black">
            사용 전 읽어주세요.
            <div className="mt-4 text-body-md text-black">
              1. 카메라를 통해 문서를 인식합니다.
              <br />
              문서를 잘 인식할 수 있는 환경에서 사용해주세요.
              <br />
              2. 최대 10장까지 업로드 가능합니다.
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/insurance/explain/upload')}
            className="rounded-2xl bg-pink-40 px-10 py-5 text-display-sm text-black shadow-[2px_3px_4px_0_rgba(0,0,0,0.25)] hover:bg-pink-60"
          >
            <div className="flex flex-row items-center justify-center gap-6">
              AI 보험 이해
              <NextIcon className="h-8 w-8" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
