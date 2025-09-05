import { useState } from 'react';
import BasicButton from '@/components/button/BasicButton';
import DietReportPage from './DietReportPage';
import WaterReportPage from './WaterReportPage';
import WeightReportPage from './WeightReportPage';
import AiReportPage from './AiReportPage';

const reportPath = {
  '식단': DietReportPage,
  '수분': WaterReportPage,
  '체중': WeightReportPage,
  'AI 리포트': AiReportPage,
};


export default function ReportPage() {
  const [activeTab, setActiveTab] = useState('식단');
  const reportTypes = [
    { name: '식단' },
    { name: '수분' },
    { name: '체중' },
    { name: 'AI 리포트' },
  ];

  const CurrentComponent = reportPath[activeTab];

  return (
    <div className='bg-white'>
      <section className='flex flex-row gap-4 py-2.5 justify-center'>
        {reportTypes.map((type) => (
          <BasicButton
            key={type.name}
            onClick={() => setActiveTab(type.name)}
            variant={activeTab === type.name ? 'filled' : 'line'}
          >{type.name}</BasicButton>
        ))}
      </section>
      <main>
        {CurrentComponent && <CurrentComponent />}
      </main>
    </div>
  );
}
