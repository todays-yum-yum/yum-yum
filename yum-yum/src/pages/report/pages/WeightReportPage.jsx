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
import { hasCurrentWeight } from '@/utils/localStorage';

export default function WeightReportPage({ originDate, fullDate }) {
  const userId = callUserUid();

  const {
    currentWeight,
    activePeriod,
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
  } = useDailyReportData(userId, originDate, {
    enabled: activePeriod === '일간',
  });
  const {
    weeklyData,
    isLoading: weeklyIsLoading,
    isError: weeklyIsError,
  } = useWeeklyReportData(userId, originDate, {
    enabled: activePeriod === '주간',
  });
  const {
    monthlyData,
    isLoading: monthlyIsLoading,
    isError: monthlyIsError,
  } = useMonthlyReportData(userId, originDate, {
    enabled: activePeriod === '월간',
  });

  const { userData } = useUserData(userId, originDate);

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
      <ChartArea originDate={originDate} date={fullDate} unit='Kg' value={dailyCurrentWeight ?? 0}>
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
