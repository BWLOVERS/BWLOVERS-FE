import SamsungLogo from '@/assets/common/logo_samsung.png';
import KyoboLifeLogo from '@/assets/common/logo_kyobo_lifeplanet_edit.png';
import LotteLogo from '@/assets/common/logo_lotte.png';
import DBLogo from '@/assets/common/logo_DB.png';
import HanhwaLogo from '@/assets/common/logo_hanhwa.png';
import KBLogo from '@/assets/common/logo_KB_edit.png';
import HyundaiLogo from '@/assets/common/logo_hyundai.png';
import ABLLogo from '@/assets/common/logo_ABL.png';
import ShinhanLogo from '@/assets/common/logo_shinhanlife.png';

export const insuranceLogoMap: Record<string, string> = {
  삼성생명: SamsungLogo,
  교보라이프플래닛생명: KyoboLifeLogo,
  신한라이프생명: ShinhanLogo,
  ABL생명: ABLLogo,
  DB생명: DBLogo,

  // 필요 시 추가
  롯데손해보험: LotteLogo,
  한화생명: HanhwaLogo,
  KB생명: KBLogo,
  현대해상: HyundaiLogo
};

// 못 찾을 때
export const defaultInsuranceLogo = ShinhanLogo;
