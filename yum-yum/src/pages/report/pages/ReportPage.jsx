import { useEffect, useState } from 'react';
import BasicButton from '@/components/button/BasicButton';
import DietReportPage from './DietReportPage';
import WaterReportPage from './WaterReportPage';
import WeightReportPage from './WeightReportPage';
import AiReportPage from './AiReportPage';

import {
  getDayOfWeek,
  todayDate,
  getStartDateOfWeek,
  getEndDateOfWeek,
  getYesterday,
  getLastMonth,
  getLastWeek,
  getNextMonth,
  getNextWeek,
  getTomorrow,
  parseDateString,
  canMoveDate,
} from '@/utils/dateUtils';


const reportPath = {
  식단: DietReportPage,
  수분: WaterReportPage,
  체중: WeightReportPage,
  'AI 리포트': AiReportPage,
};

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState('식단');
  const reportTypes = [{ name: '식단' }, { name: '수분' }, { name: '체중' }, { name: 'AI 리포트' }];
  const CurrentComponent = reportPath[activeTab];

  // 단위 기간 저장
  const [activePeriod, setActivePeriod] = useState('일간');
  // 단위 기간 날짜
  const [date, setDate] = useState(todayDate());
  // 날짜의 요일
  const day = getDayOfWeek(date);

  // 표기 날짜 : 일간/주간/월간에 따라 다름
  const getDisplayDate = (period, date, day) => {
    // 오늘 날짜, 년, 월, 일 분리
    const parsedDate = parseDateString(date);

    switch (period) {
      case '일간':
        return `${parsedDate.month}월 ${parsedDate.date}일 (${day})`;
      case '주간': {
        // 월, 일만 추출
        const startDate = parseDateString(getStartDateOfWeek(date));
        const endDate = parseDateString(getEndDateOfWeek(date));
        return `${startDate.month}월 ${startDate.date}일 ~ ${endDate.month}월 ${endDate.date}일`;
      }
      case '월간':
        return `${parsedDate.year}년 ${parsedDate.month}월`;
      default:
        return date;
    }
  };

  // 표기 날짜
  const fullDate = getDisplayDate(activePeriod, date, day);

  // 다음 단위 기간으로 갈 수 있는지(오늘보다 미래로 가는 것을 막기)
  const canMove = canMoveDate(date, activePeriod === '일간' ? 1 : activePeriod === '주간' ? 7 : 30);

  // 이전 단위 기간으로
  const handlePrevDate = () => {
    switch (activePeriod) {
      case '일간':
        setDate(getYesterday(date));
        break;
      case '주간':
        setDate(getLastWeek(date));
        break;
      case '월간':
        setDate(getLastMonth(date));
        break;
      default:
        return date;
    }
  };

  // 이후 단위 기간으로
  const handleNextDate = () => {
    switch (activePeriod) {
      case '일간':
        setDate(getTomorrow(date));
        break;
      case '주간':
        setDate(getNextWeek(date));
        break;
      case '월간':
        setDate(getNextMonth(date));
        break;
      default:
        return date;
    }
  };


  return (
    <div className='bg-white'>
      <nav className='flex flex-row gap-4 py-2.5 justify-center'>
        {reportTypes.map((type) => (
          <BasicButton
            key={type.name}
            onClick={() => setActiveTab(type.name)}
            variant={activeTab === type.name ? 'filled' : 'line'}
          >
            {type.name}
          </BasicButton>
        ))}
      </nav>
      <main>{CurrentComponent && <CurrentComponent fullDate={fullDate} activePeriod={activePeriod} setActivePeriod={setActivePeriod} 
      prev={handlePrevDate} next={handleNextDate} canMove={canMove}/>}</main>
    </div>
  );
}
