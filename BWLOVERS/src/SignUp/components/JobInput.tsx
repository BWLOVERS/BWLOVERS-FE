type JobInputProps = {
  value: string;
  onSearch: () => void;
  inError?: boolean;
  placeholder?: string;
};

export default function JobInput({
  value,
  onSearch,
  inError = false,
  placeholder = '직업을 선택해주세요'
}: JobInputProps) {
  const borderClassName = inError
    ? 'border-warning-100 bg-white'
    : 'border-gray-20 bg-white';

  return (
    <div className="flex w-full flex-col items-start gap-1.75">
      <label className="flex h-6.75 w-full flex-col justify-center self-stretch text-body-md text-black">
        직업
      </label>

      <div
        className={`flex w-full flex-row items-center justify-between gap-[0.6rem] self-stretch`}
      >
        <input
          value={value}
          readOnly
          placeholder={placeholder}
          onClick={onSearch}
          onFocus={(e) => e.currentTarget.blur()}
          className={`w-full rounded-[0.625rem] border px-4.5 py-3 text-start text-body-sm placeholder:text-caption-md placeholder:text-gray-40 ${borderClassName}`}
        />
        <button
          onClick={onSearch}
          className="h-11.25 w-18 rounded-[0.625rem] bg-pink-80 px-[0.3rem] py-2 text-body-xs text-white"
        >
          선택
        </button>
      </div>
    </div>
  );
}
