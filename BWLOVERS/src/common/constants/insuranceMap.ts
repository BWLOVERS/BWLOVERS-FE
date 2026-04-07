import SamsungLifeLogo from '@/assets/common/InsuLogo/logo_samsunglife.png';
import KyoboLifeLogo from '@/assets/common/InsuLogo/logo_kyobo_lifeplanet_edit.png';
import DBLogo from '@/assets/common/InsuLogo/logo_DB.png';
import ABLLogo from '@/assets/common/InsuLogo/logo_ABL.png';
import ShinhanLogo from '@/assets/common/InsuLogo/logo_shinhanlife.png';
import PostLifeLogo from '@/assets/common/InsuLogo/logo_postlife.png';
import DongyangLogo from '@/assets/common/InsuLogo/logo_dongyang.png';
import KyoboLogo from '@/assets/common/InsuLogo/logo_kyobo.png';
import MetlifeLogo from '@/assets/common/InsuLogo/logo_metlife.png';
import UnknownLogo from '@/assets/common/InsuLogo/logo_unknown.png';
// import LotteLogo from '@/assets/common/InsuLogo/logo_lotte.png';
// import HanhwaLogo from '@/assets/common/InsuLogo/logo_hanhwa.png';
// import KBLogo from '@/assets/common/InsuLogo/logo_KB_edit.png';
// import HyundaiLogo from '@/assets/common/InsuLogo/logo_hyundai.png';

type InsuranceInfo = {
  logo: string;
  url: string;
};

export const insuranceMap: Record<string, InsuranceInfo> = {
  삼성생명: {
    logo: SamsungLifeLogo,
    url: 'https://www.samsunglife.com/'
  },
  교보라이프플래닛생명: {
    logo: KyoboLifeLogo,
    url: 'https://www.lifeplanet.co.kr'
  },
  신한라이프생명: {
    logo: ShinhanLogo,
    url: 'https://www.shinhanlife.co.kr'
  },
  ABL생명: {
    logo: ABLLogo,
    url: 'https://www.abllife.co.kr/'
  },
  DB생명: {
    logo: DBLogo,
    url: 'https://www.idblife.com/'
  },
  우체국: {
    logo: PostLifeLogo,
    url: 'https://m.epostlife.go.kr/'
  },
  동양생명: {
    logo: DongyangLogo,
    url: 'https://www.myangel.co.kr/'
  },
  매트라이프생명: {
    logo: MetlifeLogo,
    url: 'https://www.metlife.co.kr/'
  },
  교보생명: {
    logo: KyoboLogo,
    url: 'https://www.kyobo.com'
  }

  // 예비
  // 롯데손해보험: {
  //   logo: LotteLogo,
  //   url: 'https://www.lotteins.co.kr/'
  // },
  // 한화생명: {
  //   logo: HanhwaLogo,
  //   url: 'https://www.hanwhalife.com/'
  // },
  // KB생명: {
  //   logo: KBLogo,
  //   url: 'https://www.kblife.co.kr/'
  // },
  // 현대해상: {
  //   logo: HyundaiLogo,
  //   url: 'https://www.hi.co.kr/'
  // }
};

// fallback
export const defaultInsuranceLogo = UnknownLogo;
