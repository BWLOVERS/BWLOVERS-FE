type PhotoSourceModalProps = {
  open: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickUpload: () => void;
};

export default function PhotoSourceModal({
  open,
  onClose,
  onPickCamera,
  onPickUpload
}: PhotoSourceModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999">
      {/* dim */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="닫기"
      />

      {/* sheet */}
      <div className="absolute right-0 bottom-0 left-0 rounded-t-2xl bg-white p-3">
        <button
          type="button"
          onClick={onPickCamera}
          className="w-full rounded-xl py-4 text-center text-body-md text-black active:bg-gray-10"
        >
          카메라로 촬영하기
        </button>

        <div className="my-1 h-px bg-gray-20" />

        <button
          type="button"
          onClick={onPickUpload}
          className="w-full rounded-xl py-4 text-center text-body-md text-black active:bg-gray-10"
        >
          사진 선택하기
        </button>

        <div className="my-2 h-2" />

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-gray-10 py-4 text-center text-body-md font-bold text-black active:bg-gray-20"
        >
          취소
        </button>
      </div>
    </div>
  );
}
