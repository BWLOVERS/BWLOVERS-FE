import { useEffect, useState } from 'react';

export default function Loading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-30 flex flex-1 flex-col items-center justify-center gap-8">
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-pink-60" />
      </div>

      <div className="text-body-bold-lg text-black">
        ✨ AI가 결과를 분석하는 중
        <span className="inline-block w-6 text-left">{dots}</span>
      </div>
    </div>
  );
}
