import { useRef } from 'react';
import DefaultProfile from '@/assets/common/defaultprofile.svg?react';

type ProfileImgProps = {
  imageUrl?: string | null;
};

export default function ProfileImg({ imageUrl }: ProfileImgProps) {
  return (
    <div className="h-17.5 w-17.5 overflow-hidden rounded-full">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="프로필이미지"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <DefaultProfile className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
