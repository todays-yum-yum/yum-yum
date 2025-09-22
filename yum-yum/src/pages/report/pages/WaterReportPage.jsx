import React, { useEffect, useState } from 'react';
import LineCharts from '../charts/LineCharts';
import ChartArea from '../components/ChartArea';
import WaterWeightInfo from '../components/WaterWeightInfo';
import {
  useDailyReportData,
  useWeeklyReportData,
  useMonthlyReportData,
} from '@/hooks/useReportData';
import { useUserData } from '@/hooks/useUser';

import { callUserUid } from '@/utils/localStorage';
import { useReportStore } from '@/stores/useReportStore';

const userId = callUserUid();
export default function WaterReportPage({
  originDate,
  fullDate,
  activePeriod,
  setActivePeriod,
  prev,
  next,
  canMove,
}) {
  // 데이터
  const { watersData, totalWaters, setWatersData, setMonthlyWatersData, setCalcuatWatersData, resetWaters } =
    useReportStore();

  const {
    dailyData,
    isLoading: daliyIsLoading,
    isError: daliyIsError,
  } = useDailyReportData(userId, originDate);
  const {
    weeklyData,
    isLoading: weeklyIsLoading,
    isError: weeklyIsError,
  } = useWeeklyReportData(userId, originDate);
  const {
    monthlyData,
    isLoading: monthlyIsLoading,
    isError: monthlyIsError,
  } = useMonthlyReportData(userId, originDate);
  const { userData } = useUserData(userId, originDate);

  useEffect(() => {
    resetWaters();
  }, [activePeriod]);

  useEffect(() => {
    if (activePeriod === '일간' && dailyData) {
      setWatersData(dailyData, originDate, activePeriod);
      setCalcuatWatersData(dailyData, originDate, activePeriod);
    }
  }, [dailyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '주간' && weeklyData) {
      setWatersData(weeklyData, originDate, activePeriod);
      setCalcuatWatersData(weeklyData, originDate, activePeriod);
    }
  }, [weeklyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '월간' && monthlyData) {
      setMonthlyWatersData(monthlyData, originDate, activePeriod);
      setCalcuatWatersData(monthlyData, originDate, activePeriod);
    }
  }, [monthlyData, activePeriod, originDate]);

  // useEffect(() => {
  //   console.log('waters : ', activePeriod, ':', waters);
  // }, [waters]);

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
        value={totalWaters}
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        <LineCharts datas={watersData} activePeriod={activePeriod} unit='L' />
      </ChartArea>
      <section>
        <WaterWeightInfo
          period={activePeriod}
          date={fullDate}
          unit='L'
          total={totalWaters}
          datas={watersData || []}
        />
      </section>
    </main>
  );
}
