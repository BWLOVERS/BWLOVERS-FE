import Header from '@/common/components/Header';
import TabSelector from '@/Insurance/components/TabSelector';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EditAccount from '../components/EditAccount';
import EditBasicInfo from '../components/EditBasicInfo';
import EditHealth from '../components/EditHealth';

type EditProfileTabKey = 'account' | 'info' | 'health';

const EditProfile_TABS: readonly { key: EditProfileTabKey; label: string }[] = [
  { key: 'account', label: '계정 정보' },
  { key: 'info', label: '기본 정보' },
  { key: 'health', label: '건강 상태' }
] as const;

export default function EditProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const initialTab: EditProfileTabKey =
    tabParam === 'account' || tabParam === 'info' || tabParam === 'health'
      ? tabParam
      : 'account';

  const [activeTab, setActiveTab] = useState<EditProfileTabKey>(initialTab);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <div className="sticky top-0 z-50 bg-white">
          <Header title="회원 정보 수정" onBack={() => navigate('/home')} />
          <TabSelector
            activeTab={activeTab}
            tabs={EditProfile_TABS}
            onChange={setActiveTab}
          />
        </div>

        <div className="mt-15 flex flex-1 flex-col items-center justify-center">
          {activeTab === 'account' && <EditAccount />}
          {activeTab === 'info' && <EditBasicInfo />}
          {activeTab === 'health' && <EditHealth />}
        </div>
      </div>
    </>
  );
}
