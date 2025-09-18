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
import { getWeeklyAverages } from '../../../utils/reportDataParser';

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

  const [waters, setWaters] = useState([]);
  const [calcWater, setCalcWater] = useState({});

  useEffect(() => {
    setWaters([]);
    setCalcWater(null);
  }, [activePeriod]);

  useEffect(() => {
    if (activePeriod === '일간' && dailyData) {
      const normalizedWaters = normalizeDataRange(
        dailyData?.waterData ?? [],
        originDate,
        activePeriod,
      );
      setWaters(normalizedWaters);
      setCalcWater(waterDataSummary(normalizedWaters));
    }
  }, [dailyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '주간' && weeklyData) {
      const normalizedWaters = normalizeDataRange(
        weeklyData?.waterData ?? [],
        originDate,
        activePeriod,
      );
      setWaters(normalizedWaters);
      setCalcWater(waterDataSummary(normalizedWaters));
    }
  }, [weeklyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '월간' && monthlyData) {
      const normalizedWaters = normalizeDataRange(
        monthlyData?.waterData ?? [],
        originDate,
        activePeriod,
      );

      const weeklyAverages = getWeeklyAverages(normalizedWaters, originDate);
      setWaters(weeklyAverages);
      setCalcWater(waterDataSummary(normalizedWaters));
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
        value={calcWater?.totalWaters}
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        <LineCharts datas={waters} activePeriod={activePeriod} />
      </ChartArea>
      <section>
        <WaterWeightInfo
          period={activePeriod}
          date={fullDate}
          unit='L'
          total={calcWater?.totalWaters}
          datas={waters || []}
        />
      </section>
    </main>
  );
}
