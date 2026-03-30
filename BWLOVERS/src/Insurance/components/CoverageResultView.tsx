// 이 파일은 UI만 담당
import Header from '@/common/components/Header';
import InsuranceCard from '@/Insurance/components/InsuranceCard';
import DoubleBtnModal from '@/common/components/DoubleBtnModal';
import SingleBtnModal from '@/common/components/SingleBtnModal';
import ReactMarkdown from 'react-markdown';

type InsuranceCardData = {
  productName: string;
  insuranceCompany: string;
  longTerm: boolean;
  sumInsured: number;
  monthlyCost?: string;
  memo?: string;
  createdAt?: string;
};

type BaseProps = {
  onBack: () => void;

  // 보험 카드
  insurance?: InsuranceCardData;
  selectedContractNames?: string[];

  // 상황
  situation?: string;

  // AI 결과
  resultText: string;

  // 보험 카드 아코디언
  isCardOpen: boolean;
  onToggleCard: () => void;
};

type PropsWithActions = BaseProps & {
  showActions?: true;

  // 액션(버튼) 이벤트
  onRetry: () => void;
  onClickSave: () => void;

  // 저장 모달
  isSaveConfirmOpen: boolean;
  isSaveDoneOpen: boolean;
  isSaving: boolean;
  onCloseSaveConfirm: () => void;
  onConfirmSave: () => void;
  onCloseSaveDone: () => void;
};

type PropsWithoutActions = BaseProps & {
  showActions: false;
};

type Props = PropsWithActions | PropsWithoutActions;

const hasActions = (p: Props): p is PropsWithActions => p.showActions !== false;

export default function CoverageResultView(props: Props) {
  const {
    onBack,
    insurance,
    selectedContractNames = [],
    situation = '',
    resultText,
    isCardOpen,
    onToggleCard
  } = props;

  const formattedResultText = resultText
    .trim()
    .replace(/\n(?=## )/g, '\n\n---\n\n');

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title="보장 분석" onBack={onBack} />
      </div>

      <div className="flex flex-1 flex-col gap-10 px-9 py-8">
        {/* 보험 카드 (없으면 숨김) */}
        {insurance && (
          <div className="flex flex-col gap-3">
            <div className="flex text-body-lg text-black">보험 정보</div>

            <InsuranceCard
              showForwardIcon={false}
              showMoreIcon={false}
              onClick={onToggleCard}
              productName={insurance.productName}
              insuranceCompany={insurance.insuranceCompany}
              isLongTerm={insurance.longTerm}
              sumInsured={insurance.sumInsured}
              monthlyCost={insurance.monthlyCost}
              memo={insurance.memo}
              createdAt={insurance.createdAt}
              expandable
              specialContractNames={selectedContractNames}
              isOpen={isCardOpen}
              onToggle={onToggleCard}
              hideDetailButton
            />
          </div>
        )}

        {/* 사용자 입력 상황 */}
        {situation && (
          <div className="flex flex-col gap-3">
            <div className="flex text-body-lg text-black">시뮬레이션 상황</div>
            <div className="rounded-20 bg-gray-10 p-4 text-body-md whitespace-pre-wrap text-black">
              {situation}
            </div>
          </div>
        )}

        {/* AI 답변 */}
        <div className="flex flex-col gap-3">
          <div className="flex text-body-lg text-black">
            위 보험과 상황의 경우
          </div>

          <div className="rounded-20 bg-white px-5 py-8 text-body-md whitespace-pre-wrap text-black shadow-[0_0_4px_0_rgba(0,0,0,0.10)]">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-heading-sm">
                    <span>📍</span>
                    {children}
                  </h2>
                ),
                hr: () => <hr className="border-gray-20" />,
                ul: ({ children }) => (
                  <ul className="ml-5 list-disc">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-body-md">{children}</li>
                ),
                p: ({ children }) => <p className="text-body-md">{children}</p>
              }}
            >
              {formattedResultText}
            </ReactMarkdown>
          </div>
        </div>

        {/* 액션이 있는 경우에만 렌더 */}
        {hasActions(props) && (
          <div className="mt-auto flex flex-col gap-4">
            <button
              type="button"
              onClick={props.onRetry}
              className="text-body-bold-md w-full rounded-full bg-white py-4 font-bold text-black shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-gray-10"
            >
              다시 분석하기
            </button>

            <button
              type="button"
              onClick={props.onClickSave}
              className="text-body-bold-md w-full rounded-full bg-pink-60 py-4 font-bold text-black shadow-[0_0_4px_0_rgba(0,0,0,0.20)] hover:bg-pink-80"
            >
              분석 리포트 저장하기
            </button>
          </div>
        )}
      </div>

      {/* ✅ 모달도 액션이 있는 경우에만 렌더 */}
      {hasActions(props) && (
        <>
          <DoubleBtnModal
            open={props.isSaveConfirmOpen}
            title="시뮬레이션 결과를 저장할까요?"
            content={props.isSaving ? '저장 중입니다...' : undefined}
            confirmLabel="예"
            cancelLabel="아니오"
            onClose={props.onCloseSaveConfirm}
            onConfirm={props.onConfirmSave}
          />

          <SingleBtnModal
            open={props.isSaveDoneOpen}
            title="결과 저장 완료"
            content="저장된 리포트는 홈에서 확인할 수 있습니다."
            onClose={props.onCloseSaveDone}
            onConfirm={props.onCloseSaveDone}
          />
        </>
      )}
    </div>
  );
}
