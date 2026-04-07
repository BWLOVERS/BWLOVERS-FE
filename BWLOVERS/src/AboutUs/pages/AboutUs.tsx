import Header from '@/common/components/Header';
import NavBar from '@/common/components/NavBar';
import {
  insuranceMap,
  defaultInsuranceLogo
} from '@/common/constants/insuranceMap';
import Logo from '@/assets/common/logo_title.svg?react';

export default function AboutUs() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title="서비스 소개" />
      </div>

      {/* 본문 */}
      <div className="mb-20 flex flex-1 flex-col bg-[linear-gradient(180deg,#ffe3f0_16.83%,#FFF_100%)] px-6 py-6">
        <section className="mt-4 mb-8">
          <div className="flex flex-row items-center">
            <Logo className="mr-2 w-30" />
            <div className="text-heading-lg">는 </div>
          </div>
          <div className="text-heading-sm">
            임산부 · 태아보험에서 발생할 수 있는 약관의 복잡성과 다양한 조건으로
            인한 피해를 줄이고, 나에게 꼭 맞는 적합한 보험을 선택할 수 있도록
            돕는 <span className="text-pink-100">AI 보험 분석 서비스</span>
            입니다.
          </div>
        </section>

        <div className="mb-2 text-heading-md">추천에 사용 중인 보험사</div>
        <div className="mb-4 text-body-md">
          아래 보험사의 임산부, 태아, (태아특약이 있는) 어린이 보험의 약관 및
          상품 요약서를 활용하였습니다.
          <br />
          <br />※ 보험의 약관 문서는 주기적으로 최신화 하고 있으며, 시기에 따라
          최신화 되지 않은 문서가 포함되었을 수 있으므로 자세한 내용은 각
          보험사에서 직접 확인하시기를 바랍니다.
        </div>

        <div className="text-body-bold-md mt-8 mb-4 text-center text-black">
          보험사 카드를 누르면 해당 보험사 메인 홈페이지로 이동합니다.
        </div>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(insuranceMap).map(([name, info]) => (
            <a
              key={name}
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-gray-20 bg-[rgba(255,255,255,0.75)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-md active:scale-95 active:shadow-inner"
            >
              <img
                src={info.logo ?? defaultInsuranceLogo}
                alt={name}
                className="h-12 object-contain"
              />
              <span className="text-center text-body-sm text-gray-80">
                {name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 하단 네비 */}
      <NavBar />
    </div>
  );
}
