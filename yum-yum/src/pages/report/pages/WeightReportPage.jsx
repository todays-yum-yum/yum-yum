import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';
import LineCharts from '../charts/LineCharts';
import WaterWeightInfo from '../components/WaterWeightInfo';
import {
  useDailyReportData,
  useWeeklyReportData,
  useMonthlyReportData,
} from '@/hooks/useReportData';
import { useUserData } from './../../../hooks/useUser';
import { getPeriodLastData, getWeightYearlyData, normalizeDataRange } from '../../../utils/reportDataParser';
import { getWeightWeeklyData, getWeightMonthlyData } from './../../../utils/reportDataParser';
import { callUserUid } from '@/utils/localStorage';

const userId = callUserUid();
export default function WeightReportPage({
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

  const [currentWeight, setCurrentWeight] = useState(0);
  const [weights, setWeights] = useState([])

  const onPrevPeriod = () => {
    prev();
  };

  const onNextPeriod = () => {
    next();
  };

  useEffect(() => {
    if (activePeriod === '일간' && dailyData) {
      const normalizedWaters = normalizeDataRange(
        dailyData?.weightData ?? [],
        originDate,
        activePeriod,
      );

      setCurrentWeight(getPeriodLastData(normalizedWaters).weight)
      setWeights(getWeightWeeklyData(normalizedWaters, originDate))

      // console.log(getWeightWeeklyData(normalizedWaters, originDate))
    }
  }, [dailyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '주간' && weeklyData) {
      const normalizedWaters = normalizeDataRange(
        weeklyData?.weightData ?? [],
        originDate,
        activePeriod,
      );

      setCurrentWeight(getPeriodLastData(normalizedWaters)?.weight);
      setWeights(getWeightMonthlyData(normalizedWaters, originDate))
    }
  }, [weeklyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '월간' && monthlyData) {
      const normalizedWaters = normalizeDataRange(
        monthlyData?.weightData ?? [],
        originDate,
        activePeriod,
      );

      setCurrentWeight(getPeriodLastData(normalizedWaters).weight);
      setWeights(getWeightYearlyData(normalizedWaters, originDate))
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
        <LineCharts datas={weights} activePeriod={activePeriod} unit='Kg' />
      </ChartArea>
      <section>
        <WaterWeightInfo period={activePeriod} date={fullDate} total={currentWeight} datas={weights} unit='Kg' />
      </section>
    </main>
  );
}
