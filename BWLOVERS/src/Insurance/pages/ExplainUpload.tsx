import { useEffect, useRef, useState } from 'react';
import Header from '@/common/components/Header';
import AddIcon from '@/assets/Insurance/icon_add.svg?react';
import PhotoSourceModal from '../components/PhotoSourceModal';

type PreviewItem = {
  id: string;
  file: File;
  url: string;
};

const MAX_IMAGES = 10;

export default function ExplainUpload() {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<PreviewItem[]>([]);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  const canAddMore = images.length < MAX_IMAGES;
  const remaining = MAX_IMAGES - images.length;

  const openSourceModal = () => {
    if (!canAddMore) return;
    setIsSourceModalOpen(true);
  };

  const closeSourceModal = () => setIsSourceModalOpen(false);

  const handlePickCamera = () => {
    closeSourceModal();
    cameraInputRef.current?.click();
  };

  const handlePickUpload = () => {
    closeSourceModal();
    uploadInputRef.current?.click();
  };

  const handleChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const selected = Array.from(fileList)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);

    if (selected.length === 0) {
      e.target.value = '';
      return;
    }

    const newItems: PreviewItem[] = selected.map((file) => ({
      id: `${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)}-${file.name}`,
      file,
      url: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  // 언마운트 시 URL 정리
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    console.log(images.map((i) => i.file));
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header title="보험 이해" />
      </div>

      <div className="flex flex-1 flex-col px-9 py-8">
        <div className="text-body-bold-md mb-4 text-black">
          보험 문서 사진 업로드 (최대 {MAX_IMAGES}장)
        </div>

        {/* 숨김 file input: 앨범/파일 선택 */}
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChangeFiles}
          className="hidden"
        />

        {/* 숨김 file input: 카메라 촬영 유도 (안 되면 선택 화면으로 fallback 될 수 있음) */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleChangeFiles}
          className="hidden"
        />

        {/* 썸네일 리스트: 5개씩 2줄(최대 10) */}
        <div className="grid grid-cols-5 gap-2.5 pb-2">
          {/* 추가 버튼 (10장 되면 숨김) */}
          {canAddMore && (
            <button
              type="button"
              onClick={openSourceModal}
              className="flex h-15 w-15 items-center justify-center rounded-[0.3125rem] border-2 border-gray-20 hover:bg-gray-10"
              aria-label="사진 추가"
            >
              <AddIcon />
            </button>
          )}

          {/* 업로드된 이미지들 */}
          {images.map((img) => (
            <div
              key={img.id}
              className="relative h-15 w-15 overflow-hidden rounded-[0.3125rem] border-2 border-gray-20 bg-gray-10"
            >
              <img
                src={img.url}
                alt="업로드한 문서"
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => handleRemove(img.id)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                aria-label="사진 삭제"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="text-body-bold-md mt-auto w-full rounded-full bg-pink-60 py-4 font-bold text-black disabled:bg-gray-20 disabled:text-gray-60"
          disabled={images.length === 0}
        >
          결과 보기
        </button>
      </div>

      {/* 촬영/업로드 선택 모달 */}
      <PhotoSourceModal
        open={isSourceModalOpen}
        onClose={closeSourceModal}
        onPickCamera={handlePickCamera}
        onPickUpload={handlePickUpload}
      />
    </div>
  );
}
