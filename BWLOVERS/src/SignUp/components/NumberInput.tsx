import React, { useState } from 'react';

type NumberInputProps = {
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inError?: boolean;
  digitsOnly?: boolean;
};

export default function NumberInput({
  label,
  unit,
  value,
  onChange,
  placeholder,

  inError = false,
  digitsOnly = true
}: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const next = digitsOnly ? raw.replace(/\D/g, '') : raw;
    onChange(next);
  };

  const borderClassName = inError
    ? 'border-warning-100 bg-white'
    : isFocused
      ? 'border-pink-60 bg-white'
      : 'border-gray-20 bg-white';

  return (
    <div className="flex shrink-0 flex-row items-center justify-between self-stretch py-1.25">
      <div className="text-body-md text-black">{label}</div>

      <div className="flex flex-row items-center justify-center gap-3">
        <input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`h-11.25 w-15.75 rounded-[0.625rem] border px-2.5 py-2.25 text-end text-body-sm ${borderClassName}`}
        />
        <div className="w-8 text-body-sm text-black">{unit}</div>
      </div>
    </div>
  );
}
