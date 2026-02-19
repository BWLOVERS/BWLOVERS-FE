import { useEffect, useMemo, useState } from 'react';
import CheckboxCheckIcon from '@/assets/common/icon_checkbox_check.svg?react';
import CheckboxBlankIcon from '@/assets/common/icon_checkbox_blank.svg?react';
import RadioButtonCheck from '@/assets/common/icon_radio_check.svg?react';
import RadioButtonBlank from '@/assets/common/icon_radio_blank.svg?react';

import { FORM_CONFIG, type HealthVariant } from '../data/healthFormconfig';
import {
  computeHealthFormCompleted,
  type ExtraState as ExtraStateForValidation
} from '../utils/healthFormValidation';

type ExtraState = {
  cured: 'yes' | 'no' | null;
  lastDate: string;
};

type HealthFormProps = {
  variant: HealthVariant;
  onCompleteChange?: (variant: HealthVariant, completed: boolean) => void;
};

function onlyDigitsMax8(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 8);
}

function CheckboxIcon({ checked }: { checked: boolean }) {
  const Icon = checked ? CheckboxCheckIcon : CheckboxBlankIcon;
  return <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />;
}

function RadioButton({ checked }: { checked: boolean }) {
  const Icon = checked ? RadioButtonCheck : RadioButtonBlank;
  return <Icon className="h-3.75 w-3.75 shrink-0" aria-hidden="true" />;
}

function CheckItem({
  label,
  checked,
  disabled,
  onClick
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-0.5 ${disabled ? 'opacity-40' : ''}`}
    >
      <CheckboxIcon checked={checked} />
      <span className="text-center text-body-xs text-black">{label}</span>
    </button>
  );
}

export default function HealthForm({
  variant,
  onCompleteChange
}: HealthFormProps) {
  const { groups, hasExtraInputs, isSecondCategory } = FORM_CONFIG[variant];

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [extraByDisease, setExtraByDisease] = useState<
    Record<string, ExtraState>
  >({});
  const [etcText, setEtcText] = useState('');
  const [noneChecked, setNoneChecked] = useState(false);

  const selectedDiseases = useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );

  const isCompleted = useMemo(() => {
    const extraForValidation: Record<string, ExtraStateForValidation> = {};
    selectedDiseases.forEach((d) => {
      const extra = extraByDisease[d];
      if (!extra) return;
      extraForValidation[d] = { cured: extra.cured, lastDate: extra.lastDate };
    });

    return computeHealthFormCompleted({
      hasExtraInputs,
      isSecondCategory,
      noneChecked,
      selectedDiseases,
      etcText,
      extraByDisease: extraForValidation
    });
  }, [
    hasExtraInputs,
    isSecondCategory,
    noneChecked,
    selectedDiseases,
    etcText,
    extraByDisease
  ]);

  useEffect(() => {
    onCompleteChange?.(variant, isCompleted);
  }, [onCompleteChange, variant, isCompleted]);

  const formBorder = isCompleted ? 'border-[#FFBECD]' : 'border-[#A9A9A9]';

  const toggleDisease = (disease: string) => {
    if (noneChecked) return;

    setSelected((prev) => {
      const nextChecked = !prev[disease];
      const next = { ...prev, [disease]: nextChecked };

      if (!nextChecked) {
        setExtraByDisease((prevExtra) => {
          const copied = { ...prevExtra };
          delete copied[disease];
          return copied;
        });
      } else {
        setExtraByDisease((prevExtra) => ({
          ...prevExtra,
          [disease]: prevExtra[disease] ?? {
            cured: null,
            extra2: '',
            lastDate: ''
          }
        }));
      }

      return next;
    });
  };

  const toggleNone = () => {
    setNoneChecked((prev) => {
      const next = !prev;
      if (next) {
        setSelected({});
        setExtraByDisease({});
        setEtcText('');
      }
      return next;
    });
  };

  const updateExtra = (disease: string, patch: Partial<ExtraState>) => {
    setExtraByDisease((prev) => ({
      ...prev,
      [disease]: {
        ...(prev[disease] ?? { cured: null, lastDate: '' }),
        ...patch
      }
    }));
  };

  return (
    //폼 전체
    <section
      className={`mt-3.5 flex w-76 flex-col items-center justify-center self-stretch rounded-[0.9375rem] border-[0.1rem] ${formBorder} px-5 py-5.5`}
    >
      {/*폼 내용*/}
      <div className="flex w-full flex-col gap-2.5">
        {/*질병 항목들*/}
        {groups.map((group) => {
          const selectedInGroup = group.diseases.filter((d) => !!selected[d]);

          return (
            <div
              key={group.title}
              className="flex w-full flex-col items-start gap-2.5 border-b border-[#E4E4E4] pb-4"
            >
              <div className="text-body-bold-sm flex h-5 flex-col justify-center self-stretch text-black">
                {group.title}
              </div>

              <div className="flex w-full flex-wrap items-center gap-[0.9rem] self-stretch">
                {group.diseases.map((d) => (
                  <CheckItem
                    key={d}
                    label={d}
                    checked={!!selected[d]}
                    disabled={noneChecked}
                    onClick={() => toggleDisease(d)}
                  />
                ))}
              </div>

              {/* 선택된 항목 추가 질문 */}
              {hasExtraInputs && !noneChecked && selectedInGroup.length > 0 ? (
                <div className="flex w-full flex-col items-start gap-2.5 self-stretch pt-2.5">
                  {selectedInGroup.map((disease) => {
                    const extra = extraByDisease[disease];
                    if (!extra) return null;

                    return (
                      <div
                        key={disease}
                        className="flex w-full flex-col items-start gap-[0.3rem] self-stretch px-2 pr-3.25"
                      >
                        <div className="text-body-bold-xs flex w-full items-center text-black">
                          {disease}
                        </div>

                        <div className="flex w-full flex-col items-start gap-1.25 self-stretch">
                          <div className="flex w-full items-center justify-between text-caption-md text-black">
                            <span>
                              •{' '}
                              {isSecondCategory
                                ? '현재 약물 복용 여부'
                                : '현재 완치 여부'}
                            </span>

                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                className="flex items-center gap-0.5"
                                onClick={() =>
                                  updateExtra(disease, { cured: 'yes' })
                                }
                              >
                                <RadioButton checked={extra.cured === 'yes'} />
                                <span>예</span>
                              </button>

                              <button
                                type="button"
                                className="flex items-center gap-0.5"
                                onClick={() =>
                                  updateExtra(disease, { cured: 'no' })
                                }
                              >
                                <RadioButton checked={extra.cured === 'no'} />
                                <span>아니오</span>
                              </button>
                            </div>
                          </div>

                          {!isSecondCategory ? (
                            <div className="flex w-full items-center justify-between text-caption-md text-black">
                              <span>• 마지막 치료, 진료 날짜</span>
                              <input
                                value={extra.lastDate}
                                onChange={(e) =>
                                  updateExtra(disease, {
                                    lastDate: onlyDigitsMax8(e.target.value)
                                  })
                                }
                                inputMode="numeric"
                                maxLength={8}
                                placeholder="날짜 8자리 (ex. 20250101)"
                                className="flex w-28 items-center justify-center rounded-lg border border-gray-20 bg-white px-[0.59375rem] py-1.25 text-caption-xs text-black placeholder:text-gray-40"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}

        <div className="flex w-full flex-col items-start gap-2.5 border-b border-[#E4E4E4] pb-4">
          <div className="text-body-bold-sm flex h-5 flex-col justify-center self-stretch text-black">
            기타
          </div>

          <input
            value={etcText}
            onChange={(e) => setEtcText(e.target.value)}
            disabled={noneChecked}
            placeholder="직접 입력"
            className="flex w-full items-center self-stretch rounded-[0.625rem] border border-gray-20 bg-white px-3 py-1.75 text-caption-sm text-black placeholder:text-gray-40 disabled:opacity-40"
          />
        </div>

        <div className="mt-3 flex items-center gap-0.5">
          <button
            type="button"
            onClick={toggleNone}
            className="flex items-center gap-0.5"
          >
            <CheckboxIcon checked={noneChecked} />
            <span className="text-body-bold-sm text-center text-black">
              해당 없음
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
