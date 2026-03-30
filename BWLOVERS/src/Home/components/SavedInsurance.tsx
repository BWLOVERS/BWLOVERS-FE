import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  defaultInsuranceLogo,
  insuranceLogoMap
} from '@/common/constants/insuranceLogoMap';

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
    const exact = insuranceLogoMap[insuranceCompany];
    if (exact) return exact;

    const foundKey = Object.keys(insuranceLogoMap).find((key) =>
      insuranceCompany.includes(key)
    );
    if (foundKey) return insuranceLogoMap[foundKey];

    return defaultInsuranceLogo;
  }, [insuranceCompany]);

  return (
    <div
      onClick={() => navigate(`/myinsurance/detail/${insuranceId}`)}
      className="flex h-26.25 w-26.5 shrink-0 flex-col gap-[1.19rem] rounded-20 bg-pink-40 p-2.5 hover:bg-pink-60"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/myinsurance/detail/${insuranceId}`);
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
