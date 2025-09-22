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

import { normalizeDataRange, waterDataSummary } from '@/utils/reportDataParser';
import { getWaterMonthlyAverages } from '@/utils/reportDataParser';
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
  const { watersData, totalWaters, setWatersData, setCalcuatWatersData } = useReportStore();

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

  const [calcWater, setCalcWater] = useState({});

  // useEffect(() => {
  //   setWatersData([]);
  //   setCalcuatWatersData(null);
  // }, [activePeriod]);

  useEffect(() => {
    if (activePeriod === '일간' && dailyData) {
      setWatersData(dailyData, originDate, activePeriod);
      setCalcWater(dailyData, originDate, activePeriod);
    }
  }, [dailyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '주간' && weeklyData) {
      setWatersData(weeklyData, originDate, activePeriod);
      setCalcWater(weeklyData, originDate, activePeriod);
    }
  }, [weeklyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '월간' && monthlyData) {
      setWatersData(monthlyData, originDate, activePeriod);
      setCalcWater(monthlyData, originDate, activePeriod);
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
