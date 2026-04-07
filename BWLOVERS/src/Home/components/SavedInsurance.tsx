import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  defaultInsuranceLogo,
  insuranceMap
} from '@/common/constants/insuranceMap';

type SavedInsuranceProps = {
  insuranceId: number;
  insuranceCompany: string;
  productName: string;
  createdAt: string;
};

function formatDateDot(iso: string) {
  const d = new Date(iso);
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

export default function SavedInsurance({
  insuranceId,
  insuranceCompany,
  productName,
  createdAt
}: SavedInsuranceProps) {
  const navigate = useNavigate();

  const logoSrc = useMemo(() => {
    const exact = insuranceMap[insuranceCompany];
    if (exact) return exact.logo;

    const foundKey = Object.keys(insuranceMap).find((key) =>
      insuranceCompany.includes(key)
    );
    if (foundKey) return insuranceMap[foundKey].logo;

    return defaultInsuranceLogo;
  }, [insuranceCompany]);

  function handleNavigate() {
    navigate(`/myinsurance/detail/${insuranceId}`);
  }

  return (
    <div
      onClick={handleNavigate}
      className="flex h-26.25 w-26.5 shrink-0 cursor-pointer flex-col gap-[1.19rem] rounded-20 bg-pink-40 p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-60 hover:shadow-md active:scale-95 active:shadow-inner"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNavigate();
        }
      }}
    >
      <img
        className="h-5.5 w-14 shrink-0 object-contain"
        src={logoSrc}
        alt={`${insuranceCompany} 로고`}
      />

      <div className="flex flex-col gap-[0.1rem]">
        <div className="truncate text-body-sm text-black">{productName}</div>
        <div className="text-caption-sm text-black">
          {formatDateDot(createdAt)}
        </div>
      </div>
    </div>
  );
}
