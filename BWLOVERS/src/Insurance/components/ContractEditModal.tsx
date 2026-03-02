import { useEffect, useMemo, useState } from 'react';
import ActionButtonMini from '@/common/components/ActionButtonMini';
import CheckBoxIconBlank from '@/assets/common/icon_checkbox_blank.svg?react';
import CheckBoxIconFilled from '@/assets/common/icon_checkbox_check.svg?react';
import AlertCircleIcon from '@/assets/Insurance/icon_alertCircle.svg?react';

type SpecialContract = { contract_name: string };

type ContractEditModalProps = {
  open: boolean;
  contracts: SpecialContract[];
  initialSelectedNames?: string[];
  onClose: () => void;
  onApply?: (payload: { selectedContracts: SpecialContract[] }) => void;
};

export default function ContractEditModal({
  open,
  contracts,
  initialSelectedNames,
  onClose,
  onApply
}: ContractEditModalProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!open) return;
    setSelected(new Set(initialSelectedNames ?? []));
  }, [open, initialSelectedNames]);

  const selectedContracts = useMemo(
    () => contracts.filter((c) => selected.has(c.contract_name)),
    [contracts, selected]
  );

  if (!open) return null;

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleApply = () => {
    onApply?.({ selectedContracts });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-6"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="flex w-73.75 flex-col items-center gap-7 rounded-20 bg-white px-[1.44rem] py-[1.06rem] shadow-[0_0_4px_4px_rgba(255,173,244,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-row gap-1.5 text-body-md text-black">
            특약 선택
          </div>
          <div className="flex flex-row items-center gap-1.5 text-caption-md text-gray-60">
            <AlertCircleIcon /> 이 편집은 이번 분석 1회에 한하여 유효합니다.
          </div>

          <div className="mt-2 flex flex-col gap-2">
            {contracts.map((c) => {
              const isChecked = selected.has(c.contract_name);
              const Icon = isChecked ? CheckBoxIconFilled : CheckBoxIconBlank;

              return (
                <button
                  key={c.contract_name}
                  type="button"
                  className="flex w-full flex-row items-center gap-1.5 text-left text-body-sm"
                  onClick={() => toggle(c.contract_name)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {c.contract_name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-row items-center justify-end gap-3">
          <ActionButtonMini
            label="취소"
            variant="secondary"
            onClick={onClose}
          />
          <ActionButtonMini
            label="적용"
            onClick={handleApply}
            disabled={selected.size === 0}
          />
        </div>
      </div>
    </div>
  );
}
