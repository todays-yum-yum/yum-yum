import React, { useEffect, useState } from 'react';
import ChartArea from './ChartArea';
import PieCharts from './charts/PieCharts';
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
  parseDateString
} from '@/utils/dateUtils';

export default function DietReportPage() {
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
        return `${parsedDate.year}년 ${parsedDate.month}월`
      default:
        return date;
    }
  };

  // 표기 날짜
  const fullDate = getDisplayDate(activePeriod, date, day);

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

  const data = [
    { name: '탄수화물', value: 400 },
    { name: '단백질', value: 300 },
    { name: '지방', value: 300 },
  ];

  return (
    <ChartArea
      date={fullDate}
      period='일간'
      unit='Kcal'
      value='768'
      activePeriod={activePeriod}
      prevDate={handlePrevDate}
      nextDate={handleNextDate}
      onPeriodChange={setActivePeriod}
    >
      <PieCharts data={data} />
    </ChartArea>
  );
}
