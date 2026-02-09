export default function Notice() {
  return (
    <div className="flex w-80.25 flex-col gap-7.5 text-start">
      <div className="flex flex-col gap-1.5">
        <span className="text-[0.875rem] leading-150 font-bold text-black">
          보험 분석 서비스를 위해
          <br />
          산모 건강 상태 데이터를 수집합니다.
        </span>

        <span className="text-caption-md text-black">
          잠깐! 수집된 데이터는 서비스 용도 외로 사용되지 않으니 안심하세요.
        </span>
      </div>

      <div className="flex flex-col gap-3.5 text-caption-sm text-gray-80">
        <div>
          * 아래 항목 중 해당하는 것에
          <span className="font-bold text-black"> 모두</span> 체크해주세요.
          <br />
          만약 해당하는 항목이 없다면 ‘해당 없음’에 체크하세요.
        </div>

        <div>
          * 기타 항목에는 정확한 병명이 아니어도 입력 가능합니다.
          <br />
          다만, 이 경우 입력 내용이 보험 분석 서비스에 직접 반영되지 않을 수
          있음에 <br />
          유의하시길 바랍니다.
        </div>
      </div>
    </div>
  );
}
