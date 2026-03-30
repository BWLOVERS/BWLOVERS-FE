// ReportItem.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoreIcon from '@/assets/common/icon_more_vert.svg?react';

type Props = {
  simulationId: number;
  productName: string;
  createdAt: string;
  onDelete?: (simulationId: number) => void | Promise<void>;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

export default function ReportItem({
  simulationId,
  productName,
  createdAt,
  onDelete
}: Props) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isMenuOpen]);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    await onDelete?.(simulationId);
  };

  return (
    <div
      onClick={() => navigate(`/myreport/${simulationId}`)}
      className="flex w-full cursor-pointer flex-col gap-3 rounded-20 bg-pink-20 px-7 py-5 shadow-[0_0_4px_0_rgba(0,0,0,0.10)] hover:bg-pink-40"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-heading-sm text-black">{`시뮬레이션 (${simulationId})`}</div>

        <div className="flex flex-row items-center">
          <div className="text-body-sm text-black">{formatDate(createdAt)}</div>

          <div className="relative ml-4 shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={handleMoreClick}
              className="flex items-center justify-center"
              aria-label="more menu"
            >
              <MoreIcon className="h-5 w-5 rounded-full hover:bg-pink-60" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute top-8 right-0 z-50 w-26 rounded-xl bg-white py-2 shadow-[0_4px_10px_rgba(0,0,0,0.12)] hover:bg-gray-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-left text-body-sm text-black"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="truncate text-body-md text-black">{productName}</div>
    </div>
  );
}
