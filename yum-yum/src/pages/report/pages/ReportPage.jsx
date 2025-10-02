import { useEffect, useState } from 'react';
import BasicButton from '@/components/button/BasicButton';
import DietReportPage from './DietReportPage';
import WaterReportPage from './WaterReportPage';
import WeightReportPage from './WeightReportPage';
import AiReportPage from './AiReportPage';
import { useReportStore } from '@/stores/useReportStore';

import {
  getDayOfWeek,
} from '@/utils/dateUtils';

const reportPath = {
  식단: DietReportPage,
  수분: WaterReportPage,
  체중: WeightReportPage,
  'AI 리포트': AiReportPage,
};

// 쿼리 스트링
const reportParam = {
  diet: '식단',
  water: '수분',
  weight: '체중',
  ai: 'AI 리포트',
};

// 파라미터 변환
const tabToParam = {
  식단: 'diet',
  수분: 'water',
  체중: 'weight',
  'AI 리포트': 'ai',
};

export default function ReportPage() {
  const { 
    // 날짜
    date, setDate, 
    // 캘린더
    calendarOpen, setCalendarOpen, 
    // 단위 기간 저장
    activePeriod, setActivePeriod, 
    // 리포트 종류
    reportTypes,
    // 계산
    getDisplayDate,
  } = useReportStore();

  // 현재 활성화 된 리포트탭
  const [activeTab, setActiveTab] = useState(null);
  
  const CurrentComponent = reportPath[activeTab];

  // 날짜의 요일
  const day = getDayOfWeek(date);

  // 최초 탭 설정
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    let initialTab = '식단'; // 기본값

    if (tabParam && reportParam[tabParam]) {
      initialTab = reportParam[tabParam];
    } else {
      const url = new URL(window.location);
      url.searchParams.set('tab', tabToParam[initialTab]);
      window.history.replaceState({}, '', url);
    }
    setActiveTab(initialTab);
  }, []);

  // 탭 변경시 주소 변경
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);

    const urlParam = tabToParam[tabName];
    if (urlParam) {
      const url = new URL(window.location);
      url.searchParams.set('tab', urlParam);
      window.history.pushState({}, '', url);
    }
  };

  // 표기 날짜
  const fullDate = getDisplayDate(activePeriod, date, day);

  useEffect(() => {
    setCalendarOpen(false)
  }, [activeTab, activePeriod]);

  return (
    <div className='bg-white flex flex-col'>
      <nav className='flex flex-row gap-4 py-2.5 justify-center'>
        {reportTypes.map((type) => (
          <BasicButton
            key={type.name}
            onClick={() => handleTabChange(type.name)}
            variant={activeTab === type.name ? 'filled' : 'line'}
          >
            {type.name}
          </BasicButton>
        ))}
      </nav>
      <main className='h-full '>
        {CurrentComponent && (
          <CurrentComponent
            originDate={date}
            fullDate={fullDate}
          />
        )}
      </main>
    </div>
  );
}
