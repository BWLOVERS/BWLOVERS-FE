import { useState } from 'react';
import Header from '@/common/components/Header';
import NavBar from '@/common/components/NavBar';
import TabSelector from '../components/TabSelector';

import RecommendationTab from '../components/Tabs/RecommendationTab';
import CoverageTab from '../components/Tabs/CoverageTab';
import ExplainTab from '../components/Tabs/ExplainTab';

type InsuranceTabKey = 'recommendation' | 'coverage' | 'explain';

const INSURANCE_TABS: readonly {
  key: InsuranceTabKey;
  label: string;
}[] = [
  { key: 'recommendation', label: '보험 추천' },
  { key: 'coverage', label: '보장 분석' },
  { key: 'explain', label: '보험 이해' }
] as const;

export default function InsuranceMain() {
  const [activeTab, setActiveTab] = useState<InsuranceTabKey>('recommendation');

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <div className="sticky top-0 z-50 bg-white">
          <Header title="보험 분석" />
          <TabSelector
            activeTab={activeTab}
            tabs={INSURANCE_TABS}
            onChange={setActiveTab}
          />
        </div>

        <div className="flex-1 pb-24">
          {activeTab === 'recommendation' && <RecommendationTab />}
          {activeTab === 'coverage' && <CoverageTab />}
          {activeTab === 'explain' && <ExplainTab />}
        </div>
      </div>
      <NavBar />
    </>
  );
}
