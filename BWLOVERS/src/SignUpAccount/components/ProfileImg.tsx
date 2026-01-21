import { useRef } from 'react';
import DefaultProfile from '@/assets/common/defaultprofile.svg?react';
import CameraIcon from '@/assets/SignUp/icon_camera.svg?react';

type ProfileImgProps = {
  imageUrl?: string | null;
  alt?: string;
  onChange?: (file: File) => void;
};

export default function ProfileImg({
  imageUrl,
  alt = '프로필 이미지',
  onChange
}: ProfileImgProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange?.(file);
  };

  return (
    <div className="group relative mb-[2.13rem] h-28 w-28 overflow-hidden rounded-full bg-white">
      {/* 프로필 이미지 */}
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <DefaultProfile className="h-full w-full" />
        </div>
      )}

      {/* hover 시 나타나는 오버레이 */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="프로필 이미지 업로드"
        className="absolute inset-0 flex items-center justify-center bg-[rgba(83,83,83,0.40)] opacity-0 backdrop-blur-[1.5px] transition-opacity group-hover:opacity-100"
      >
        <CameraIcon className="h-7.5 w-7.5" />
      </button>

      {/* 실제 파일 input (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
