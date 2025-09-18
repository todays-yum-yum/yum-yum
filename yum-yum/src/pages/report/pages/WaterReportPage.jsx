import React, { useEffect, useState } from 'react';
import LineCharts from '../charts/LineCharts';
import ChartArea from '../components/ChartArea';
import WaterWeightInfo from '../components/WaterWeightInfo';
import {
  useDailyReportData,
  useWeeklyReportData,
  useMonthlyReportData,
} from '@/hooks/useReportData';
import { normalizeDataRange } from './../../../utils/reportDataParser';

const userId = 'test-user';
export default function WaterReportPage({
  originDate,
  fullDate,
  activePeriod,
  setActivePeriod,
  prev,
  next,
  canMove,
}) {
  const {
    userData: dailyUserData,
    dailyData,
    isLoading: daliyIsLoading,
    isError: daliyIsError,
  } = useDailyReportData(userId, originDate);
  const {
    userData: weeklyUserData,
    weeklyData,
    isLoading: weeklyIsLoading,
    isError: weeklyIsError,
  } = useWeeklyReportData(userId, originDate);
  const {
    userData: monthlyUserData,
    monthlyData,
    isLoading: monthlyIsLoading,
    isError: monthlyIsError,
  } = useMonthlyReportData(userId, originDate);

  const [waters, setWaters] = useState({});

  useEffect(() => {
    if (activePeriod === '일간' && dailyData) {
      setWaters(
        normalizeDataRange(dailyData?.waterData ?? [], originDate, activePeriod),
      );
    }
  }, [dailyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '주간' && weeklyData) {
      setWaters(
        normalizeDataRange(weeklyData?.waterData ?? [], originDate, activePeriod),
      );
    }
  }, [weeklyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '월간' && monthlyData) {
      setWaters(
        normalizeDataRange(monthlyData?.waterData ?? [], originDate, activePeriod),
      );

      
    }
  }, [monthlyData, activePeriod, originDate]);

  useEffect(() => {
    console.log(waters[0]?.value)
  }, [waters])

  const onPrevPeriod = () => {
    prev();
  };

  const onNextPeriod = () => {
    next();
  };

  return (
    <main className='flex flex-col gap-7.5'>
      <ChartArea
        date={fullDate}
        period='일간'
        unit='L'
        value={waters[0]?.value.dailyTotal}
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        <LineCharts />
      </ChartArea>
      <section>
        <WaterWeightInfo period={activePeriod} date={fullDate} unit='L' datas={waters[0]?.value.intakes} />
      </section>
    </main>
  );
}