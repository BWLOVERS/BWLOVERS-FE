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

export type ExtraState = {
  cured: 'yes' | 'no' | null;
  lastDate: string;
};

export type HealthFormValue = {
  noneChecked: boolean;
  selected: Record<string, boolean>;
  extraByDisease: Record<string, ExtraState>;
};

type HealthFormProps = {
  variant: HealthVariant;
  onCompleteChange?: (variant: HealthVariant, completed: boolean) => void;
  onValueChange?: (variant: HealthVariant, value: HealthFormValue) => void;

  // ✅ 추가: 외부에서 값 주입(조회/store 연동용)
  value?: HealthFormValue;
};

function onlyDigitsMax6(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 6);
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
  onCompleteChange,
  onValueChange,
  value
}: HealthFormProps) {
  const { groups, hasExtraInputs, isSecondCategory } = FORM_CONFIG[variant];

  // ✅ controlled 모드 여부
  const isControlled = value !== undefined;

  // (uncontrolled용) 내부 state는 기존대로 유지
  const [selectedState, setSelectedState] = useState<Record<string, boolean>>(
    {}
  );
  const [extraByDiseaseState, setExtraByDiseaseState] = useState<
    Record<string, ExtraState>
  >({});
  const [noneCheckedState, setNoneCheckedState] = useState(false);

  // ✅ 렌더링/검증에 사용하는 “진짜 값”
  const selected = isControlled ? value.selected : selectedState;
  const extraByDisease = isControlled
    ? value.extraByDisease
    : extraByDiseaseState;
  const noneChecked = isControlled ? value.noneChecked : noneCheckedState;

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
      extraByDisease: extraForValidation
    });
  }, [
    hasExtraInputs,
    isSecondCategory,
    noneChecked,
    selectedDiseases,
    extraByDisease
  ]);

  useEffect(() => {
    onCompleteChange?.(variant, isCompleted);
  }, [onCompleteChange, variant, isCompleted]);

  // ✅ 기존 코드의 “state 변화 감지 → onValueChange 호출”은 uncontrolled에서만 실행
  // controlled에서는 이 effect가 store를 빈 값으로 덮어쓰는 문제가 생길 수 있음
  useEffect(() => {
    if (isControlled) return;
    onValueChange?.(variant, {
      noneChecked: noneCheckedState,
      selected: selectedState,
      extraByDisease: extraByDiseaseState
    });
  }, [
    isControlled,
    onValueChange,
    variant,
    noneCheckedState,
    selectedState,
    extraByDiseaseState
  ]);

  // ✅ controlled/uncontrolled 공통: nextValue 만들어 올리는 helper
  const emitNext = (next: HealthFormValue) => {
    onValueChange?.(variant, next);

    // uncontrolled일 때만 내부 state도 갱신
    if (!isControlled) {
      setNoneCheckedState(next.noneChecked);
      setSelectedState(next.selected);
      setExtraByDiseaseState(next.extraByDisease);
    }
  };

  const formBorder = isCompleted ? 'border-[#FFBECD]' : 'border-[#d1d1d1]';

  const toggleDisease = (disease: string) => {
    if (noneChecked) return;

    const nextChecked = !selected[disease];
    const nextSelected = { ...selected, [disease]: nextChecked };

    let nextExtraByDisease = { ...extraByDisease };

    if (!nextChecked) {
      delete nextExtraByDisease[disease];
    } else {
      nextExtraByDisease[disease] = nextExtraByDisease[disease] ?? {
        cured: null,
        lastDate: ''
      };
    }

    emitNext({
      noneChecked,
      selected: nextSelected,
      extraByDisease: nextExtraByDisease
    });
  };

  const toggleNone = () => {
    const nextNone = !noneChecked;

    if (nextNone) {
      emitNext({
        noneChecked: true,
        selected: {},
        extraByDisease: {}
      });
      return;
    }

    emitNext({
      noneChecked: false,
      selected,
      extraByDisease
    });
  };

  const updateExtra = (disease: string, patch: Partial<ExtraState>) => {
    const prev = extraByDisease[disease] ?? { cured: null, lastDate: '' };
    const nextExtraByDisease = {
      ...extraByDisease,
      [disease]: { ...prev, ...patch }
    };

    emitNext({
      noneChecked,
      selected,
      extraByDisease: nextExtraByDisease
    });
  };

  return (
    <section
      className={`mt-3.5 flex w-76 flex-col items-center justify-center self-stretch rounded-[0.9375rem] border-[0.1rem] ${formBorder} px-5 py-5.5`}
    >
      <div className="flex w-full flex-col gap-2.5">
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
                              •
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
                              <span>• 마지막 치료, 진료 월</span>
                              <input
                                value={extra.lastDate}
                                onChange={(e) =>
                                  updateExtra(disease, {
                                    lastDate: onlyDigitsMax6(e.target.value)
                                  })
                                }
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="연,월만 입력 (ex. 202501)"
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
