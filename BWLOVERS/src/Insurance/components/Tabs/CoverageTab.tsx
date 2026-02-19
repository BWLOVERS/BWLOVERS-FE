import WaveBackground from '@/assets/Insurance/bg_wave_wide.svg?react';
import NextIcon from '@/assets/Insurance/icon_arrow_next.svg?react';

export default function CoverageTab() {
  return (
    <section className="relative flex-1 overflow-hidden pb-24">
      <WaveBackground className="absolute top-0 left-0" />

      <div className="relative z-10 flex flex-col items-center gap-50 pt-15">
        <div className="flex flex-col items-start gap-8 text-black">
          <div className="text-heading-md">보장 분석 서비스</div>
          <div className="text-heading-sm">
            산모님이 기존에 입력한 정보를 바탕으로, <br />
            보장 여부를 직접 시뮬레이션 할 수 있어요.
          </div>
        </div>

        <button
          type="button"
          className="rounded-2xl bg-pink-40 px-10 py-5 text-display-sm text-black shadow-[2px_3px_4px_0_rgba(0,0,0,0.25)] hover:bg-pink-60"
        >
          <div className="flex flex-row items-center justify-center gap-6">
            AI 분석 시작 <NextIcon className="h-8 w-8" />
          </div>
        </button>
      </div>
    </section>
  );
}
