import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';
// 차트
import PieCharts from '../charts/PieCharts';
import StackedCharts from '../charts/StackedCharts';
import RoundButton from '@/components/button/RoundButton';
import NutritionFood from '../components/NutritionFood';
import NutritionInfo from '../components/NutritionInfo';

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
import { dataSummary, normalizeDataRange } from '@/utils/reportDataParser';
import { getAllMealsSorted } from '@/utils/reportDataParser';
import { toNum } from '@/utils/NutrientNumber';
import { roundTo1 } from '@/utils/NutrientNumber';
import { useUserData } from '@/hooks/useUser';
import { callUserUid } from '@/utils/localStorage';

const userId = callUserUid();
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

  // 영양정보, 탄단지 내림차순 정보
  const [nutrient, setNutrient] = useState({});
  const [carbsSortedFoods, setCarbsSortedFoods] = useState([]);
  const [proteinSortedFoods, setProteinSortedFoods] = useState([]);
  const [fatSortedFoods, setFatSortedFoods] = useState([]);

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
    if (activePeriod === '일간' && dailyData) {
      setNutrient(
        dataSummary(normalizeDataRange(dailyData?.mealData ?? [], originDate, activePeriod)),
      );
      setActiveDetailTab('영양 정보');
    }
  }, [dailyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '주간' && weeklyData) {
      setNutrient(
        dataSummary(normalizeDataRange(weeklyData?.mealData ?? [], originDate, activePeriod)),
      );
      setActiveDetailTab('영양 정보');
    }
  }, [weeklyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '월간' && monthlyData) {
      setNutrient(
        dataSummary(normalizeDataRange(monthlyData?.mealData ?? [], originDate, activePeriod)),
      );
      setActiveDetailTab('영양 정보');
    }
  }, [monthlyData, activePeriod, originDate]);

  useEffect(() => {
    if (activePeriod === '일간') {
      setCarbsSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(dailyData?.mealData ?? [], originDate, activePeriod),
          'carbs',
        ),
      );

      setProteinSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(dailyData?.mealData ?? [], originDate, activePeriod),
          'protein',
        ),
      );

      setFatSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(dailyData?.mealData ?? [], originDate, activePeriod),
          'fat',
        ),
      );
    } else if (activePeriod === '주간') {
      setCarbsSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(weeklyData?.mealData ?? [], originDate, activePeriod),
          'carbs',
        ),
      );

      setProteinSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(weeklyData?.mealData ?? [], originDate, activePeriod),
          'protein',
        ),
      );

      setFatSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(weeklyData?.mealData ?? [], originDate, activePeriod),
          'fat',
        ),
      );
    } else if (activePeriod === '월간') {
      setCarbsSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(monthlyData?.mealData ?? [], originDate, activePeriod),
          'carbs',
        ),
      );

      setProteinSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(monthlyData?.mealData ?? [], originDate, activePeriod),
          'protein',
        ),
      );

      setFatSortedFoods(
        getAllMealsSorted(
          normalizeDataRange(monthlyData?.mealData ?? [], originDate, activePeriod),
          'fat',
        ),
      );
    }
  }, [nutrient]);

  // 스택 차트, 영양정보, 영양소별 음식 정보 매핑
  const topChart = [
    {
      name: '탄수화물',
      food: carbsSortedFoods ?? [],
      goal: 120,
      total: roundTo1(toNum(nutrient.totalCarbs)),
    },
    {
      name: '단백질',
      food: proteinSortedFoods ?? [],
      goal: 120,
      total: roundTo1(toNum(nutrient.totalProtein)),
    },
    {
      name: '지방',
      food: fatSortedFoods ?? [],
      goal: 50,
      total: roundTo1(toNum(nutrient.totalFat)),
    },
  ];

  // console.log(topChart ?? {});

  return (
    <main className='flex flex-col gap-7.5'>
      <ChartArea
        date={fullDate}
        period='일간'
        unit='Kcal'
        value={nutrient?.totalCalories ?? 0}
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
    </main>
  );
}
