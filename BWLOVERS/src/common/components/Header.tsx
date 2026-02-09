import BackwardIcon from '@/assets/common/icon_backward.svg?react';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export default function Header({
  title,
  showBack = true,
  onBack
}: HeaderProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack(); //정해진 경로로 이동할 때 이 옵션 사용
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="sticky top-0 z-50 grid h-18.25 w-full grid-cols-3 bg-white pt-5.25 pb-3">
      <div className="flex cursor-pointer items-center justify-start pl-7">
        {showBack && <BackwardIcon className="h-6 w-6" onClick={handleBack} />}
      </div>
      <div className="flex items-center justify-center text-heading-sm text-black">
        {title}
      </div>
    </div>
  );
}
