import Header from '@/common/components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import type { OcrJobResponse } from '@/apis/ocr/ocrApi';

function SectionCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-20 bg-white p-4 shadow-sm">
      <div className="text-body-bold-md mb-3 text-black">{title}</div>
      {children}
    </section>
  );
}

interface ExplainResultProps {
  onClickExtractPdf?: () => void;
}

export default function ExplainResult({
  onClickExtractPdf
}: ExplainResultProps) {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { response?: OcrJobResponse } };
  const response = location.state?.response;

  // status가 DONE이 아니거나 result가 없을 경우
  const result = response?.result;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title="보험 이해" onBack={() => navigate('/insurance')} />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-9 py-8">
        {/* result가 없는 경우 */}
        {!response || !result ? (
          <div className="rounded-xl border border-gray-20 bg-white p-4">
            <div className="text-body-md text-gray-80">
              결과 데이터가 없습니다. 다시 시도해 주세요.
            </div>
          </div>
        ) : (
          <>
            {/* 상단 요약 배지 */}
            <div className="rounded-xl bg-gray-10 p-4">
              <div className="flex items-center justify-between">
                <div className="text-body-bold-md text-black">분석 결과</div>
                <div className="rounded-full bg-pink-60 px-3 py-1 text-[12px] font-bold text-black">
                  {response.status}
                </div>
              </div>

              {response.progress && (
                <div className="text-gray-70 mt-2 text-[12px]">
                  진행: {response.progress.donePages}/
                  {response.progress.totalPages}
                </div>
              )}
            </div>
            {/*  한 줄 요약 */}
            <SectionCard title="한 줄 요약">
              <div className="text-gray-90 text-body-md whitespace-pre-wrap">
                {result.oneLineSummary}
              </div>
            </SectionCard>

            {/*  쉬운 설명 */}
            <SectionCard title="쉬운 설명">
              <div className="text-gray-90 text-body-md leading-6 whitespace-pre-wrap">
                {result.easyExplanation}
              </div>
            </SectionCard>

            {/*  핵심 포인트 */}
            <SectionCard title="핵심 포인트">
              <ul className="text-gray-90 list-disc space-y-2 pl-5 text-body-md">
                {result.importantPoints.map((p, idx) => (
                  <li key={`${idx}-${p}`} className="whitespace-pre-wrap">
                    {p}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* 주의사항 */}
            <SectionCard title="주의사항">
              <ul className="text-gray-90 list-disc space-y-2 pl-5 text-body-md">
                {result.warnings.map((w, idx) => (
                  <li key={`${idx}-${w}`} className="whitespace-pre-wrap">
                    {w}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* 용어 정리 */}
            <SectionCard title="용어 정리">
              <div className="space-y-3">
                {result.terms.map((t, idx) => (
                  <div
                    key={`${idx}-${t.term}`}
                    className="rounded-lg bg-gray-10 p-3"
                  >
                    <div className="text-body-bold-md text-black">{t.term}</div>
                    <div className="text-gray-90 mt-1 text-body-md whitespace-pre-wrap">
                      {t.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
            <div className="mt-5 flex flex-col gap-4">
              <button
                type="button"
                onClick={onClickExtractPdf}
                className="text-body-bold-md w-full rounded-full bg-pink-60 py-4 font-bold text-black shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-pink-80"
              >
                PDF로 내용 추출하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
