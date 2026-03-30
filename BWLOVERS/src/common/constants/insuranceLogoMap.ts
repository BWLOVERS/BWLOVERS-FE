import SamsungLogo from '@/assets/common/InsuLogo/logo_samsung.png';
import KyoboLifeLogo from '@/assets/common/InsuLogo/logo_kyobo_lifeplanet_edit.png';
import LotteLogo from '@/assets/common/InsuLogo/logo_lotte.png';
import DBLogo from '@/assets/common/InsuLogo/logo_DB.png';
import HanhwaLogo from '@/assets/common/InsuLogo/logo_hanhwa.png';
import KBLogo from '@/assets/common/InsuLogo/logo_KB_edit.png';
import HyundaiLogo from '@/assets/common/InsuLogo/logo_hyundai.png';
import ABLLogo from '@/assets/common/InsuLogo/logo_ABL.png';
import ShinhanLogo from '@/assets/common/InsuLogo/logo_shinhanlife.png';
import PostLifeLogo from '@/assets/common/InsuLogo/logo_postlife.png';
import DongyangLogo from '@/assets/common/InsuLogo/logo_dongyang.png';
import KyoboLogo from '@/assets/common/InsuLogo/logo_kyobo.png';
import MetlifeLogo from '@/assets/common/InsuLogo/logo_metlife.png';
import UnknownLogo from '@/assets/common/InsuLogo/logo_unknown.png';

export const insuranceLogoMap: Record<string, string> = {
  삼성생명: SamsungLogo,
  교보라이프플래닛생명: KyoboLifeLogo,
  신한라이프생명: ShinhanLogo,
  ABL생명: ABLLogo,
  DB생명: DBLogo,
  우체국: PostLifeLogo,
  동양생명: DongyangLogo,
  매트라이프생명: MetlifeLogo,
  교보생명: KyoboLogo,

  //예비
  롯데손해보험: LotteLogo,
  한화생명: HanhwaLogo,
  KB생명: KBLogo,
  현대해상: HyundaiLogo
};

// 못 찾을 때
export const defaultInsuranceLogo = UnknownLogo;
