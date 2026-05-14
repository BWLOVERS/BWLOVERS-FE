import Header from '@/common/components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import type { OcrJobResponse } from '@/apis/ocr/ocrApi';
import { useState } from 'react';
import { useUserAccountStore } from '@/SignUp/stores/userAccountStore';
import PretendardRegular from '@/assets/fonts/Pretendard-Regular.ttf';
import PretendardBold from '@/assets/fonts/Pretendard-Bold.ttf';
import Logo from '@/assets/common/logo_icon.svg';
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf
} from '@react-pdf/renderer';

Font.register({
  family: 'Pretendard',
  fonts: [
    {
      src: PretendardRegular,
      fontWeight: 400
    },
    {
      src: PretendardBold,
      fontWeight: 700
    }
  ]
});

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

const pdfStyles = StyleSheet.create({
  pdfMetaCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff4f7',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pdfMetaLeft: { flex: 1 },
  pdfLogo: {
    widht: 40,
    height: 40,
    objectFit: 'contain'
  },
  pdfMetaTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111111',
    marginBottom: 6
  },
  pdfMetaText: {
    fontSize: 10,
    color: '#555555',
    marginBottom: 3
  },
  page: {
    padding: 28,
    backgroundColor: '#ffffff',
    fontFamily: 'Pretendard'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#888888'
  },
  container: {
    gap: 12
  },
  topCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
    marginBottom: 12
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111111'
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#ff8fb3',
    fontSize: 10,
    fontWeight: 700,
    color: '#111111'
  },
  progress: {
    marginTop: 8,
    fontSize: 10,
    color: '#666666'
  },
  section: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: '#ffffff',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#111111',
    marginBottom: 8
  },
  bodyText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333333'
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6
  },
  bullet: {
    width: 10,
    fontSize: 11,
    color: '#333333'
  },
  listText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333333'
  },
  termCard: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    marginBottom: 8
  },
  termTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#111111',
    marginBottom: 4
  },
  termMeaning: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333'
  }
});

function PdfSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={pdfStyles.section} wrap={false}>
      <Text style={pdfStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InsuranceResultPdf({
  response,
  result,
  userName,
  extractedDate
}: {
  response: OcrJobResponse;
  result: NonNullable<OcrJobResponse['result']>;
  userName?: string;
  extractedDate: string;
}) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.container}>
          {/* PDF 문서 정보 */}
          <View style={pdfStyles.pdfMetaCard}>
            <View style={pdfStyles.pdfMetaLeft}>
              <Text style={pdfStyles.pdfMetaTitle}>
                {userName ?? '사용자'} 님의 보험 이해 결과 보고서
              </Text>
              <Text style={pdfStyles.pdfMetaText}>
                추출 날짜: {extractedDate}
              </Text>
            </View>

            <Image src={Logo} style={pdfStyles.pdfLogo} />
          </View>
          {/* 상단 요약 배지 */}
          <View style={pdfStyles.topCard}>
            <View style={pdfStyles.topRow}>
              <Text style={pdfStyles.title}>분석 결과</Text>
              <Text style={pdfStyles.statusBadge}>{response.status}</Text>
            </View>

            {response.progress && (
              <Text style={pdfStyles.progress}>
                진행: {response.progress.donePages}/
                {response.progress.totalPages}
              </Text>
            )}
          </View>

          {/*  한 줄 요약 */}
          <PdfSection title="한 줄 요약">
            <Text style={pdfStyles.bodyText}>{result.oneLineSummary}</Text>
          </PdfSection>

          {/*  쉬운 설명 */}
          <PdfSection title="쉬운 설명">
            <Text style={pdfStyles.bodyText}>{result.easyExplanation}</Text>
          </PdfSection>

          {/*  핵심 포인트 */}
          <PdfSection title="핵심 포인트">
            {result.importantPoints.map((p, idx) => (
              <View key={`${idx}-${p}`} style={pdfStyles.listItem}>
                <Text style={pdfStyles.bullet}>•</Text>
                <Text style={pdfStyles.listText}>{p}</Text>
              </View>
            ))}
          </PdfSection>

          {/* 주의사항 */}
          <PdfSection title="주의사항">
            {result.warnings.map((w, idx) => (
              <View key={`${idx}-${w}`} style={pdfStyles.listItem}>
                <Text style={pdfStyles.bullet}>•</Text>
                <Text style={pdfStyles.listText}>{w}</Text>
              </View>
            ))}
          </PdfSection>

          {/* 용어 정리 */}
          <PdfSection title="용어 정리">
            {result.terms.map((t, idx) => (
              <View key={`${idx}-${t.term}`} style={pdfStyles.termCard}>
                <Text style={pdfStyles.termTitle}>{t.term}</Text>
                <Text style={pdfStyles.termMeaning}>{t.meaning}</Text>
              </View>
            ))}
          </PdfSection>
        </View>
        <Text
          style={pdfStyles.pageNumber}
          fixed
          render={({ pageNumber, totalPages }) =>
            `보험 이해 결과 보고서 |  ${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

export default function ExplainResult() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { response?: OcrJobResponse } };
  const response = location.state?.response;
  const user = useUserAccountStore((state) => state.me);
  // status가 DONE이 아니거나 result가 없을 경우
  const result = response?.result;

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleExtractPdf = async () => {
    if (!response || !result || isPdfLoading) return;

    try {
      setIsPdfLoading(true);

      const extractedDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      const blob = await pdf(
        <InsuranceResultPdf
          response={response}
          result={result}
          userName={user?.username}
          extractedDate={extractedDate}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = '보험_이해_결과.pdf';
      document.body.appendChild(link);
      link.click();

      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsPdfLoading(false);
    }
  };

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
            <div className="flex flex-col gap-4">
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
                      <div className="text-body-bold-md text-black">
                        {t.term}
                      </div>
                      <div className="text-gray-90 mt-1 text-body-md whitespace-pre-wrap">
                        {t.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <button
                type="button"
                onClick={handleExtractPdf}
                disabled={isPdfLoading}
                className="text-body-bold-md w-full rounded-full bg-pink-60 py-4 font-bold text-black shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-pink-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPdfLoading ? 'PDF 생성 중...' : 'PDF로 내용 추출하기'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
