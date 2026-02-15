import { useMemo, useState } from 'react';
import ActionButtonMini from '@/common/components/ActionButtonMini';
import CheckBoxIconBlank from '@/assets/common/icon_checkbox_blank.svg?react';
import CheckBoxIconFilled from '@/assets/common/icon_checkbox_check.svg?react';

type SpecialContract = { contract_name: string };

type SaveResultModalProps = {
  open: boolean;
  contracts: SpecialContract[];
  onClose: () => void;
  onSave?: (payload: {
    selectedContracts: SpecialContract[];
    memo: string;
  }) => void;
};

export default function SaveResultModal({
  open,
  contracts,
  onClose,
  onSave
}: SaveResultModalProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [memo, setMemo] = useState('');

  const selectedContracts = useMemo(
    () => contracts.filter((c) => selected.has(c.contract_name)),
    [contracts, selected]
  );

  // ✅ Hook들 다 호출한 뒤에 early return
  if (!open) return null;

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleSave = () => {
    onSave?.({ selectedContracts, memo });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-6"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="flex w-73.75 flex-col items-center gap-7 rounded-20 bg-white px-[1.44rem] py-[1.06rem] shadow-[0_0_4px_4px_rgba(255,173,244,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-row gap-1.5 text-body-md text-black">
            특약 선택 <p className="text-warning-100">*</p>
          </div>

          <div className="flex flex-col gap-2">
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

        <div className="flex w-full flex-col gap-2">
          <div className="text-body-md text-black">메모</div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={20}
            className="h-20 resize-none rounded-2xl bg-gray-20 p-4 text-body-sm text-black"
          />

          <div className="text-right text-caption-sm text-gray-60">
            {memo.length} / 20
          </div>
        </div>

        <div className="flex w-full flex-row items-center justify-end gap-3">
          <ActionButtonMini
            label="취소"
            variant="secondary"
            onClick={onClose}
          />
          <ActionButtonMini
            label="저장"
            onClick={handleSave}
            disabled={selected.size === 0}
          />
        </div>
      </div>
    </div>
  );
}
