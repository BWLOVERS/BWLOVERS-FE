import { useEffect, useState } from 'react';

type ProgressBarProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function ProgressBar({
  currentStep,
  totalSteps = 3
}: ProgressBarProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [currentStep]);

  const progressRatio = Math.min(Math.max(currentStep / totalSteps, 0), 1);

  return (
    <div className="absolute bottom-0 left-0 z-50 w-full">
      <div className="relative grid h-1.5 w-full grid-cols-3">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className="h-1.5 w-full bg-pink-20" />
        ))}

        {/* 진행도 표시 바 */}
        <div
          className="absolute top-0 left-0 h-full origin-left bg-pink-100 transition-transform duration-500 ease-out"
          style={{
            width: `${progressRatio * 100}%`,
            transform: `scaleX(${animate ? 1 : 0})`
          }}
        />
      </div>
    </div>
  );
}
