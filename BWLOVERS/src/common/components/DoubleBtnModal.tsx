import { useEffect, useMemo, useState } from 'react';
import ActionButtonFreesize from './ActionButtonFreesize';

type DoubleBtnModalProps = {
  open: boolean;
  title: string;
  content?: string;
  cancelLabel?: string;
  confirmLabel?: string;

  requireConfirmText?: boolean;
  confirmText?: string;

  onClose: () => void;
  onConfirm: () => void;
};

export default function DoubleBtnModal({
  open,
  title,
  content,
  cancelLabel = '취소',
  confirmLabel = '확인',
  requireConfirmText = false,
  confirmText = '확인했습니다.',
  onClose,
  onConfirm
}: DoubleBtnModalProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) setInputValue('');
  }, [open]);

  const isConfirmEnabled = useMemo(() => {
    if (!requireConfirmText) return true;
    return inputValue.trim() === confirmText;
  }, [requireConfirmText, inputValue, confirmText]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 px-6"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="flex w-74 flex-col items-center justify-center gap-5 rounded-20 bg-white px-[1.94rem] py-[1.19rem] shadow-[0_0_4px_4px_rgba(255,188,204,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full flex-col gap-3 text-center">
          <div className="text-body-bold-lg text-black">{title}</div>

          {content && (
            <div className="text-body-md whitespace-pre-line text-black">
              {content}
            </div>
          )}

          {requireConfirmText && (
            <div className="mt-2 flex w-full flex-col gap-2">
              <div className="text-body-xs text-gray-80">
                아래 문구를 정확히 입력해주세요:
                <br />
                <span className="text-black">{confirmText}</span>
              </div>

              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={confirmText}
                className="h-11 w-full rounded-[15px] border border-gray-40 px-4 text-body-md text-black outline-none focus:border-gray-60"
              />
            </div>
          )}
        </div>

        <div className="flex w-full flex-row items-center justify-center gap-2.75">
          <ActionButtonFreesize
            width="w-full"
            label={confirmLabel}
            onClick={onConfirm}
            disabled={!isConfirmEnabled}
          />
          <ActionButtonFreesize
            width="w-full"
            variant="secondary"
            label={cancelLabel}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
