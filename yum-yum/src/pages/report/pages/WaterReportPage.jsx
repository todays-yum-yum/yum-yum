import React, { useEffect, useState } from 'react';
import LineCharts from '../charts/LineCharts';
import ChartArea from '../components/ChartArea';
import WaterWeightInfo from '../components/WaterWeightInfo';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import {
  useDailyReportData,
  useWeeklyReportData,
  useMonthlyReportData,
} from '@/hooks/useReportData';
import { useUserData } from '@/hooks/useUser';

import { callUserUid } from '@/utils/localStorage';
import { useReportStore } from '@/stores/useReportStore';

export default function WaterReportPage({ originDate, fullDate }) {
  // 데이터
  const userId = callUserUid();

  const {
    watersData,
    totalWaters,
    setWatersData,
    setMonthlyWatersData,
    setCalcuatWatersData,
    resetWaters,
    activePeriod,
  } = useReportStore();

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

  useEffect(() => {
    resetWaters();
  }, [activePeriod]);

  // 수분 데이터 및 수분량 계산 결과 설정
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

  return (
    <main className='flex flex-col gap-7.5'>
      <ChartArea originDate={originDate} date={fullDate} unit='L' value={totalWaters}>
        {(daliyIsLoading || weeklyIsLoading || monthlyIsLoading) && (
          <div className='flex items-center justify-center'>
            <LoadingSpinner />
          </div>
        )}

        {/* 수분량 그래프 */}
        {!(daliyIsLoading || weeklyIsLoading || monthlyIsLoading) && (
          <LineCharts datas={watersData} activePeriod={activePeriod} unit='L' />
        )}
      </ChartArea>

      {(daliyIsLoading || weeklyIsLoading || monthlyIsLoading) && (
        <div className='flex items-center justify-center'>
          <LoadingSpinner />
        </div>
      )}

      {/* 수분량 상세 표 */}
      {!(daliyIsLoading || weeklyIsLoading || monthlyIsLoading) && (
        <>
          <section>
            <WaterWeightInfo
              period={activePeriod}
              date={fullDate}
              unit='L'
              total={totalWaters}
              datas={watersData || []}
            />
          </section>
        </>
      )}
    </main>
  );
}
