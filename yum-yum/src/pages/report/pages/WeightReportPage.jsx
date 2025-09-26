import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';
import LineCharts from '../charts/LineCharts';
import WaterWeightInfo from '../components/WaterWeightInfo';

// 훅
import {
  useDailyReportData,
  useWeeklyReportData,
  useMonthlyReportData,
} from '@/hooks/useReportData';
import { useUserData } from '@/hooks/useUser';

// 유틸
import { callUserUid } from '@/utils/localStorage';

// 스토어
import { useReportStore } from '@/stores/useReportStore';
import { useHomeStore } from '@/stores/useHomeStore';
import { hasCurrentWeight } from '../../../utils/localStorage';

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

  const {
    currentWeight,
    weightData,
    setCurrentWeight,
    setDailyWeightData,
    setWeeklyWeightData,
    setMonthlyWeightData,
  } = useReportStore();
  // const { currentWeight: dailyCurrentWeight } = useHomeStore();
  const dailyCurrentWeight = hasCurrentWeight();

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

  // 기간 변경
  const onPrevPeriod = () => {
    prev();
  };

  const onNextPeriod = () => {
    next();
  };

  // 기간별 체중과 체중 비교 데이터 설정
  useEffect(() => {
    if (activePeriod === '일간' && dailyData) {
      // 일간의 경우 사용자 정보의 현재 체중을 사용
      setCurrentWeight(dailyCurrentWeight, originDate, activePeriod);
      setDailyWeightData(dailyData, originDate, activePeriod);
    }
  }, [dailyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '주간' && weeklyData) {
      setCurrentWeight(weeklyData, originDate, activePeriod);
      setWeeklyWeightData(weeklyData, originDate, activePeriod);
    }
  }, [weeklyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '월간' && monthlyData) {
      setCurrentWeight(monthlyData, originDate, activePeriod);
      setMonthlyWeightData(monthlyData, originDate, activePeriod);
    }
  }, [monthlyData, activePeriod, originDate]);

  return (
    <main className='flex flex-col gap-7.5'>
      <ChartArea
        date={fullDate}
        period='일간'
        unit='Kg'
        value={dailyCurrentWeight ?? 0}
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        <LineCharts datas={weightData} activePeriod={activePeriod} unit='Kg' />
      </ChartArea>
      <section>
        <WaterWeightInfo
          period={activePeriod}
          date={fullDate}
          total={dailyCurrentWeight}
          datas={weightData}
          unit='Kg'
        />
      </section>
    </main>
  );
}
