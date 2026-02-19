import { useState } from 'react';
import type { ToggleValue } from '../types/signupBasicInfo';

type ToggleInputProps = {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value?: ToggleValue;
  onChange?: (value: ToggleValue) => void;
};

export default function ToggleInput({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange
}: ToggleInputProps) {
  const [internalValue, setInternalValue] = useState<ToggleValue>(null);

  const selectedValue = value ?? internalValue;

  const handleSelect = (val: ToggleValue) => {
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  return (
    <div className="flex flex-row items-center justify-between self-stretch py-1.25">
      <div className="text-body-md text-black">{label}</div>

      <div className="flex w-28.25 items-center justify-center">
        <button
          type="button"
          onClick={() => handleSelect('yes')}
          className={`flex h-8.5 w-13.5 shrink-0 items-center justify-center gap-2.5 rounded-l-[0.625rem] border border-gray-20 text-body-sm text-black ${selectedValue === 'yes' ? 'bg-pink-40' : 'bg-white'}`}
        >
          {leftLabel}
        </button>

        <button
          type="button"
          onClick={() => handleSelect('no')}
          className={`flex h-8.5 w-13.5 shrink-0 items-center justify-center gap-2.5 rounded-r-[0.625rem] border-t border-r border-b border-gray-20 text-body-sm text-black ${selectedValue === 'no' ? 'bg-pink-40' : 'bg-white'}`}
        >
          {rightLabel}
        </button>
      </div>
    </div>
  );
}
