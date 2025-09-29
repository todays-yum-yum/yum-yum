import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';
import { useReportStore } from '@/stores/useReportStore';

// 차트
import PieCharts from '../charts/PieCharts';
import StackedCharts from '../charts/StackedCharts';
import RoundButton from '@/components/button/RoundButton';
import NutritionFood from '../components/NutritionFood';
import NutritionInfo from '../components/NutritionInfo';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// 아이콘
import Carbohydrate from '@/assets/icons/icon-carbohydrate.svg?react';
import Fat from '@/assets/icons/icon-fat.svg?react';
import Protein from '@/assets/icons/icon-protein.svg?react';

// 훅
import {
  useDailyReportData,
  useMonthlyReportData,
  useWeeklyReportData,
} from '@/hooks/useReportData';

// 유틸
import { roundTo1, toNum } from '@/utils/nutrientNumber';
import { useUserData } from '@/hooks/useUser';
import { callUserUid } from '@/utils/localStorage';


export default function DietReportPage({
  originDate,
  fullDate,
  activePeriod,
  setActivePeriod,
  prev,
  next,
  canMove,
}) {
  // 데이터
  const userId = callUserUid();
  const {
    nutrients,
    mealSortedByCarbs,
    mealSortedByFat,
    mealSortedByProtein,
    setNutrients,
    setSortedByNutrients,
  } = useReportStore();

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

  // 상세 정보 토글버튼
  const [activeDetailTab, setActiveDetailTab] = useState('영양 정보');
  const DetailTab = [{ name: '영양 정보' }, { name: '영양소 별 음식' }];

  // 이전, 다음 기간 함수
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

  const isLoading = daliyIsLoading || weeklyIsLoading || monthlyIsLoading;
  const isError = daliyIsError || weeklyIsError || monthlyIsError;

  useEffect(() => {
    let currentData = null;

    if (activePeriod === '일간' && dailyData) {
      currentData = dailyData;
    } else if (activePeriod === '주간' && weeklyData) {
      currentData = weeklyData;
    } else if (activePeriod === '월간' && monthlyData) {
      currentData = monthlyData;
    }

    if (currentData) {
      setNutrients(currentData, originDate, activePeriod);
      setSortedByNutrients(currentData, originDate, activePeriod, 'carbs');
      setSortedByNutrients(currentData, originDate, activePeriod, 'protein');
      setSortedByNutrients(currentData, originDate, activePeriod, 'fat');
      setActiveDetailTab('영양 정보');
    }
  }, [userData, dailyData, weeklyData, monthlyData, activePeriod, originDate]);

  // 단위 기간 별, 영양소 내림차순 정렬
  useEffect(() => {
    if (activePeriod === '일간') {
      setSortedByNutrients(dailyData, originDate, activePeriod, 'carbs');
      setSortedByNutrients(dailyData, originDate, activePeriod, 'protein');
      setSortedByNutrients(dailyData, originDate, activePeriod, 'fat');
    } else if (activePeriod === '주간') {
      setSortedByNutrients(weeklyData, originDate, activePeriod, 'carbs');
      setSortedByNutrients(weeklyData, originDate, activePeriod, 'protein');
      setSortedByNutrients(weeklyData, originDate, activePeriod, 'fat');
    } else if (activePeriod === '월간') {
      setSortedByNutrients(monthlyData, originDate, activePeriod, 'carbs');
      setSortedByNutrients(monthlyData, originDate, activePeriod, 'protein');
      setSortedByNutrients(monthlyData, originDate, activePeriod, 'fat');
    }
  }, [nutrients]);

  // 스택 차트, 영양정보, 영양소별 음식 정보 매핑
  const topChart = [
    {
      name: '탄수화물',
      food: mealSortedByCarbs ?? [],
      goal: 120,
      total: roundTo1(toNum(nutrients.totalCarbs)),
    },
    {
      name: '단백질',
      food: mealSortedByProtein ?? [],
      goal: 120,
      total: roundTo1(toNum(nutrients.totalProtein)),
    },
    {
      name: '지방',
      food: mealSortedByFat ?? [],
      goal: 50,
      total: roundTo1(toNum(nutrients.totalFat)),
    },
  ];

  // console.log(topChart ?? {});

  return (
    <main className='flex flex-col gap-7.5'>
      {(daliyIsLoading || weeklyIsLoading || monthlyIsLoading) && (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!(daliyIsLoading || weeklyIsLoading || monthlyIsLoading) && (
        <>
          <ChartArea
            date={fullDate}
            period='일간'
            unit='Kcal'
            value={nutrients?.totalCalories ?? 0}
            activePeriod={activePeriod}
            prevDate={onPrevPeriod}
            nextDate={onNextPeriod}
            canMove={canMove}
            onPeriodChange={setActivePeriod}
          >
            {/* 탄단지 비율 차트 */}
            <PieCharts data={nutrients} />
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
            {activeDetailTab === '영양 정보' && <NutritionInfo nutritionData={nutrients} />}

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
                      <span className='w-20 font-bold text-xl text-center'>{data.total}g</span>
                    </div>

                    {/* 스택 차트 */}
                    <StackedCharts foodData={data} />

                    {/* 음식 목록 */}
                    <NutritionFood foodData={data} />
                  </React.Fragment>
                ))}
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
}
