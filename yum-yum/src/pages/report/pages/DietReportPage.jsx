import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';
// 차트
import PieCharts from '../charts/PieCharts';
import StackedCharts from '../charts/stackedCharts';
import RoundButton from '@/components/button/RoundButton';
import NutritionFood from '../components/NutritionFood';
import NutritionInfo from '../components/NutritionInfo';

// 아이콘
import Carbohydrate from '@/assets/icons/icon-carbohydrate.svg?react';
import Fat from '@/assets/icons/icon-fat.svg?react';
import Protein from '@/assets/icons/icon-protein.svg?react';

import {
  useDailyReportData,
  useMonthlyReportData,
  useWeeklyReportData,
} from '@/hooks/useReportData';
import { dataSummary, normalizeDataRange } from '@/utils/reportDataParser';
import { getAllMealsSorted } from './../../../utils/reportDataParser';

const userId = 'test-user';
export default function DietReportPage({
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
  // 상세 정보 토글버튼
  const [activeDetailTab, setActiveDetailTab] = useState('영양 정보');
  const DetailTab = [{ name: '영양 정보' }, { name: '영양소 별 음식' }];

  const [nutrient, setNutrient] = useState({});

  const onPrevPeriod = () => {
    prev();
  };

  const onNextPeriod = () => {
    next();
  };

  // 영양소별 음식 아이콘
  const nutritionIcon = {
    탄수화물: <Carbohydrate />,
    단백질: <Protein />,
    지방: <Fat />,
  };

  useEffect(() => {
    if (activePeriod === '일간') {
      setNutrient(
        dataSummary(normalizeDataRange(dailyData?.mealData ?? [], originDate, activePeriod)),
      );
    } else if (activePeriod === '주간') {
      setNutrient(
        dataSummary(normalizeDataRange(weeklyData?.mealData ?? [], originDate, activePeriod)),
      );
    } else if (activePeriod === '월간') {
      setNutrient(
        dataSummary(normalizeDataRange(monthlyData?.mealData ?? [], originDate, activePeriod)),
      );
      console.log(getAllMealsSorted(normalizeDataRange(monthlyData?.mealData ?? [], originDate, activePeriod)));
    }
  }, [dailyData, weeklyData, monthlyData, activePeriod]);

  const topChart = [
    {
      name: '탄수화물',
      food: [
        { name: '쌀밥', percent: 56, value: 49.2, count: 1 },
        { name: '계란', percent: 26, value: 22.8, count: 1 },
        { name: '빵', percent: 11, value: 10, count: 1 },
        { name: '과자', percent: 5, value: 5, count: 1 },
      ],
      goal: 120,
      top1: 40,
      top2: 20,
      top3: 10,
      etc: 0,
    },
    {
      name: '단백질',
      food: [
        { name: '쌀밥', percent: 56, value: 49.2, count: 1 },
        { name: '계란', percent: 26, value: 22.8, count: 1 },
        { name: '빵', percent: 11, value: 10, count: 1 },
        { name: '과자', percent: 5, value: 5, count: 1 },
      ],
      goal: 120,
      top1: 60,
      top2: 30,
      top3: 10,
      etc: 30,
    },
    {
      name: '지방',
      food: [
        { name: '쌀밥', percent: 56, value: 49.2, count: 1 },
        { name: '계란', percent: 26, value: 22.8, count: 1 },
        { name: '빵', percent: 11, value: 10, count: 1 },
        { name: '과자', percent: 5, value: 5, count: 1 },
      ],
      goal: 50,
      top1: 20,
      top2: 20,
      top3: 10,
      etc: 0,
    },
  ];

  return (
    <main className='flex flex-col gap-7.5'>
      <ChartArea
        date={fullDate}
        period='일간'
        unit='Kcal'
        value={nutrient.totalCalories}
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        {/* 탄단지 비율 차트 */}
        <PieCharts data={nutrient} />
      </ChartArea>

      {/* 영양 정보 & 영양소별 음식 토글 버튼*/}
      <section className='flex flex-row items-center justify-center'>
        <article className='w-fit flex flex-row items-center justify-center p-2 gap-2.5 rounded-full bg-gray-600'>
          {DetailTab.map((tab) => (
            <RoundButton
              key={tab.name}
              onClick={() => setActiveDetailTab(tab.name)}
              color={activeDetailTab === tab.name ? 'primary' : 'gray'}
            >
              {tab.name}
            </RoundButton>
          ))}
        </article>
      </section>

      {/*  영양 정보 & 영양소별 음식 영역  */}
      <section className='flex flex-col items-center justify-center'>
        {/* 영양 정보 */}
        {activeDetailTab === '영양 정보' && <NutritionInfo nutritionData={nutrient} />}

        {/* 영양소 별 음식 */}
        {activeDetailTab === '영양소 별 음식' && (
          <>
            {topChart.map((data, index) => (
              <React.Fragment key={index}>
                {/* 헤더 영역 */}
                <div className='w-full m-2 flex flex-row items-center justify-around'>
                  <span className='w-10 font-bold text-xl text-center'>
                    {nutritionIcon[data.name]}
                  </span>
                  <span className='w-20 font-bold text-xl text-center'>{data.name}</span>
                  <span className='w-10 font-bold text-xl text-center'>{458}g</span>
                </div>

                {/* 스택 차트 */}
                <StackedCharts data={data} />

                {/* 음식 목록 */}
                <NutritionFood foodData={data} />
              </React.Fragment>
            ))}
          </>
        )}
      </section>
    </main>
  );
}
