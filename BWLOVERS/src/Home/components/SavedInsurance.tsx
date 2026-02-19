{
  /*
  import SamsungLogo from '@/assets/common/logo_samsung.png';
import KyoboLogo from '@/assets/common/logo_kyobo_lifeplanet_edit.png';
import LotteLogo from '@/assets/common/logo_lotte.png';
import DBLogo from '@/assets/common/logo_DB.png';
import HanhwaLogo from '@/assets/common/logo_hanhwa.png';
import KBLogo from '@/assets/common/logo_KB_edit.png';
import HyundaiLogo from '@/assets/common/logo_hyundai.png';
import ABLLogo from '@/assets/common/logo_ABL.png';
*/
}
import ShinhanLogo from '@/assets/common/logo_shinhanlife.png';
import { useNavigate } from 'react-router-dom';

export default function SavedInsurance() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/myinsurance/detail')}
      className="flex h-26.25 w-26.5 shrink-0 flex-col gap-[1.19rem] rounded-20 bg-pink-40 p-2.5 hover:bg-pink-60"
    >
      <img className="h-5.5 w-14 shrink-0" src={ShinhanLogo} alt="삼성로고" />

      <div className="flex flex-col gap-[0.1rem]">
        <div className="truncate text-body-sm text-black">
          한화건강쑥쑥어린이보험
        </div>
        <div className="text-caption-sm text-black">2025.01.01</div>
      </div>
    </div>
  );
}
