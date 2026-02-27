import { useEffect } from 'react';
import ActionButtonFreesize from './ActionButtonFreesize';

type SingleBtnModalProps = {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function SingleBtnModal({
  open,
  title,
  content,
  onClose,
  onConfirm
}: SingleBtnModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

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
          <div className="text-body-md whitespace-pre-line text-black">
            {content}
          </div>
        </div>

        <ActionButtonFreesize
          width="w-25.5"
          label="확인"
          onClick={() => {
            onConfirm();
          }}
        />
      </div>
    </div>
  );
}
