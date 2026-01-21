import { useId, useState } from 'react';

type LabeledInputProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;

  placeholder?: string;
  disabled?: boolean;

  maxLength?: number; // 있으면 카운터 표시
};

export default function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  maxLength
}: LabeledInputProps) {
  const inputId = useId();
  const [isFocused, setIsFocused] = useState(false);

  const hasCounter = typeof maxLength === 'number';
  const isOverLimit = hasCounter ? value.length > maxLength : false;

  const borderClassName = disabled
    ? 'border-gray-20 bg-gray-10'
    : isFocused
      ? 'border-pink-60'
      : 'border-gray-20';

  const textClassName = disabled ? 'text-gray-60' : 'text-black';

  const counterClassName = isOverLimit
    ? 'text-warning-100'
    : isFocused
      ? 'text-black'
      : 'text-gray-40';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex w-full flex-col items-start gap-1.75">
      <label
        htmlFor={inputId}
        className="flex h-6.75 w-full flex-col justify-center self-stretch text-body-md text-black"
      >
        {label}
      </label>

      <div
        className={`flex w-full items-center justify-between self-stretch rounded-[0.625rem] border px-[1.125rem] py-3 ${borderClassName}`}
      >
        <input
          id={inputId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-transparent text-body-sm outline-none ${textClassName}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {hasCounter ? (
          <div
            className={`flex h-2.5 w-9 flex-col justify-center text-caption-sm ${counterClassName}`}
          >
            {value.length}/{maxLength}
          </div>
        ) : null}
      </div>
    </div>
  );
}
