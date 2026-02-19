import { useEffect, useMemo, useState } from 'react';
import ActionButtonMini from '@/common/components/ActionButtonMini';
import CheckboxBlankIcon from '@/assets/common/icon_checkbox_blank.svg?react';
import CheckboxFillIcon from '@/assets/common/icon_checkbox_check.svg?react';

const INSURERS = [
  '교보라이프플래닛생명',
  '교보생명',
  '동양생명',
  '메트라이프생명',
  '삼성생명',
  '신한라이프생명',
  'ABL생명',
  'DB생명'
] as const;

type Insurer = (typeof INSURERS)[number];
type Period = 'long' | 'short';

export type FilterValue = {
  insurers: Insurer[];
  periods: Period[];
  maxMonthlyFee: number | 'all';
};

type FilterModalProps = {
  open: boolean;
  top: number;
  value: FilterValue;
  onClose: () => void;
  onApply: (next: FilterValue) => void;
};

const MIN_FEE = 0;
const MAX_FEE = 100_000;
const STEP = 1_000;

export default function FilterModal({
  open,
  top,
  value,
  onClose,
  onApply
}: FilterModalProps) {
  const [selectedInsurers, setSelectedInsurers] = useState<Set<Insurer>>(
    new Set()
  );
  const [selectedPeriods, setSelectedPeriods] = useState<Set<Period>>(
    new Set()
  );
  const [maxMonthlyFee, setMaxMonthlyFee] = useState<number | 'all'>('all');

  useEffect(() => {
    if (!open) return;
    setSelectedInsurers(new Set(value.insurers));
    setSelectedPeriods(new Set(value.periods));
    setMaxMonthlyFee(value.maxMonthlyFee ?? 'all');
  }, [open, value.insurers, value.periods, value.maxMonthlyFee]);

  const handleToggleInsurer = (name: Insurer) => {
    setSelectedInsurers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleTogglePeriod = (period: Period) => {
    setSelectedPeriods((prev) => {
      const next = new Set(prev);
      if (next.has(period)) next.delete(period);
      else next.add(period);
      return next;
    });
  };

  const numericFee = maxMonthlyFee === 'all' ? MAX_FEE : maxMonthlyFee;

  const progressPercent = useMemo(() => {
    const clamped = Math.min(Math.max(numericFee, MIN_FEE), MAX_FEE);
    return ((clamped - MIN_FEE) / (MAX_FEE - MIN_FEE)) * 100;
  }, [numericFee]);

  const displayFeeText =
    maxMonthlyFee === 'all'
      ? '0원 ~ 전체'
      : `0원 ~ 월 ${maxMonthlyFee.toLocaleString()}원 이하`;

  const handleReset = () => {
    setSelectedInsurers(new Set());
    setSelectedPeriods(new Set());
    setMaxMonthlyFee('all');
  };

  const handleApply = () => {
    onApply({
      insurers: Array.from(selectedInsurers),
      periods: Array.from(selectedPeriods),
      maxMonthlyFee
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div
        className="absolute left-1/2 w-full -translate-x-1/2"
        style={{ top }}
      >
        <div className="mx-auto flex w-92.25 flex-col rounded-[0.9375rem] bg-white px-5 py-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
          <div className="flex w-full items-center justify-between">
            <div className="text-body-bold-lg text-black">결과 필터</div>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-md px-2 py-1 text-caption-md text-gray-60 hover:bg-gray-20"
            >
              초기화
            </button>
          </div>

          <div className="mt-6 flex w-full flex-col gap-6">
            <div className="flex w-full flex-row items-start justify-between gap-4">
              <div className="w-16 shrink-0 text-body-sm text-black">
                보험사명
              </div>

              <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-2 text-caption-md text-black">
                {INSURERS.map((name) => {
                  const checked = selectedInsurers.has(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleToggleInsurer(name)}
                      className="flex items-start justify-start gap-1 text-left"
                    >
                      {checked ? (
                        <CheckboxFillIcon className="h-4 w-4 shrink-0" />
                      ) : (
                        <CheckboxBlankIcon className="h-4 w-4 shrink-0" />
                      )}
                      <span className="text-caption-md text-black">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex w-full flex-row items-start justify-between gap-4">
              <div className="w-16 shrink-0 text-body-sm whitespace-nowrap text-black">
                보장기간
              </div>

              <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-2">
                <button
                  type="button"
                  onClick={() => handleTogglePeriod('long')}
                  className="flex items-start justify-start gap-1 text-left"
                >
                  {selectedPeriods.has('long') ? (
                    <CheckboxFillIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <CheckboxBlankIcon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="text-caption-md text-black">장기</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTogglePeriod('short')}
                  className="flex items-start justify-start gap-1 text-left"
                >
                  {selectedPeriods.has('short') ? (
                    <CheckboxFillIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <CheckboxBlankIcon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="text-caption-md text-black">단기</span>
                </button>
              </div>
            </div>

            <div className="flex w-full flex-row items-start justify-between gap-4">
              <div className="w-16 shrink-0 text-body-sm whitespace-nowrap text-black">
                예상 보험료
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-caption-md text-black">
                  {displayFeeText}
                </div>

                <div className="mt-4 mr-1.5">
                  <div className="relative w-full">
                    <div className="h-1.5 w-full rounded-full bg-gray-20" />
                    <div
                      className="absolute top-0 left-0 h-1.5 rounded-full bg-pink-60"
                      style={{ width: `${progressPercent}%` }}
                    />

                    <input
                      type="range"
                      min={MIN_FEE}
                      max={MAX_FEE}
                      step={STEP}
                      value={numericFee}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setMaxMonthlyFee(v >= MAX_FEE ? 'all' : v);
                      }}
                      className="absolute inset-0 z-20 h-10 w-full cursor-pointer opacity-0"
                      aria-label="월 예상 보험료 상한"
                    />

                    <div
                      className="absolute top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-pink-60 shadow-[0_0_4px_rgba(0,0,0,0.25)]"
                      style={{ left: `calc(${progressPercent}% - 7px)` }}
                    />
                  </div>

                  <div className="mt-2 flex w-full justify-between text-caption-md text-gray-60">
                    <span>{MIN_FEE.toLocaleString()}</span>
                    <span>전체</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex w-full justify-end gap-3">
            <ActionButtonMini
              label="닫기"
              variant="secondary"
              onClick={onClose}
            />
            <ActionButtonMini
              label="적용"
              variant="primary"
              onClick={handleApply}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
