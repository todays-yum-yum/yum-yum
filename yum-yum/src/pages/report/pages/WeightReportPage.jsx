import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';
import LineCharts from '../charts/LineCharts';
import WaterWeightInfo from '../components/WaterWeightInfo';
import {
  useDailyReportData,
  useWeeklyReportData,
  useMonthlyReportData,
} from '@/hooks/useReportData';
import { useUserData } from '@/hooks/useUser';
import { getPeriodLastData, getWeightYearlyData, normalizeDataRange } from '@/utils/reportDataParser';
import { getWeightWeeklyData, getWeightMonthlyData } from '@/utils/reportDataParser';
import { callUserUid } from '@/utils/localStorage';
import { useReportStore } from '@/stores/useReportStore';

export default function WeightReportPage({
  originDate,
  fullDate,
  activePeriod,
  setActivePeriod,
  prev,
  next,
  canMove,
}) {
  const userId = callUserUid();

  const { currentWeight, weightData, setCurrentWeight, setDailyWeightData, setWeeklyWeightData, setMonthlyWeightData } =
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

  const onPrevPeriod = () => {
    prev();
  };

  const onNextPeriod = () => {
    next();
  };

  useEffect(() => {
    if (activePeriod === '일간' && dailyData) {

      setCurrentWeight(dailyData, originDate, activePeriod)
      setDailyWeightData(dailyData, originDate, activePeriod)
    }
  }, [dailyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '주간' && weeklyData) {

      setCurrentWeight(weeklyData, originDate, activePeriod)
      setWeeklyWeightData(weeklyData, originDate, activePeriod)
    }
  }, [weeklyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '월간' && monthlyData) {

      setCurrentWeight(monthlyData, originDate, activePeriod)
      setMonthlyWeightData(monthlyData, originDate, activePeriod)
    }
  }, [monthlyData, activePeriod, originDate]);

  return (
    <main className='flex flex-col gap-7.5'>
      <ChartArea
        date={fullDate}
        period='일간'
        unit='Kg'
        value={currentWeight ?? 0}
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        <LineCharts datas={weightData} activePeriod={activePeriod} unit='Kg' />
      </ChartArea>
      <section>
        <WaterWeightInfo period={activePeriod} date={fullDate} total={currentWeight} datas={weightData} unit='Kg' />
      </section>
    </main>
  );
}
