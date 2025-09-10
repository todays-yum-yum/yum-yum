import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';
import PieCharts from '../charts/PieCharts';
import {
  getDayOfWeek,
  todayDate,
  getStartDateOfWeek,
  getEndDateOfWeek,
  getYesterday,
  getLastMonth,
  getLastWeek,
  getNextMonth,
  getNextWeek,
  getTomorrow,
  parseDateString,
  canMoveDate,
} from '@/utils/dateUtils';
import RoundButton from '@/components/button/RoundButton';
import NutritionInfo from '../components/NutritionInfo';
import StackedCharts from '../charts/stackedCharts';
import Carbohydrate from '@/assets/icons/icon-carbohydrate.svg?react';
import Fat from '@/assets/icons/icon-fat.svg?react';
import Protein from '@/assets/icons/icon-protein.svg?react';
import NutritionFood from '../components/NutritionFood';

export default function DietReportPage() {
  // 단위 기간 저장
  const [activePeriod, setActivePeriod] = useState('일간');
  // 단위 기간 날짜
  const [date, setDate] = useState(todayDate());
  // 날짜의 요일
  const day = getDayOfWeek(date);

  const [activeDetailTab, setActiveDetailTab] = useState('영양 정보');
  const DetailTab = [{ name: '영양 정보' }, { name: '영양소 별 음식' }];

  // 표기 날짜 : 일간/주간/월간에 따라 다름
  const getDisplayDate = (period, date, day) => {
    // 오늘 날짜, 년, 월, 일 분리
    const parsedDate = parseDateString(date);

    switch (period) {
      case '일간':
        return `${parsedDate.month}월 ${parsedDate.date}일 (${day})`;
      case '주간': {
        // 월, 일만 추출
        const startDate = parseDateString(getStartDateOfWeek(date));
        const endDate = parseDateString(getEndDateOfWeek(date));
        return `${startDate.month}월 ${startDate.date}일 ~ ${endDate.month}월 ${endDate.date}일`;
      }
      case '월간':
        return `${parsedDate.year}년 ${parsedDate.month}월`;
      default:
        return date;
    }
  };

  // 표기 날짜
  const fullDate = getDisplayDate(activePeriod, date, day);

  // 다음 단위 기간으로 갈 수 있는지(오늘보다 미래로 가는 것을 막기)
  const canMove = canMoveDate(date, activePeriod === '일간' ? 1 : activePeriod === '주간' ? 7 : 30);

  // 이전 단위 기간으로
  const handlePrevDate = () => {
    switch (activePeriod) {
      case '일간':
        setDate(getYesterday(date));
        break;
      case '주간':
        setDate(getLastWeek(date));
        break;
      case '월간':
        setDate(getLastMonth(date));
        break;
      default:
        return date;
    }
  };

  // 이후 단위 기간으로
  const handleNextDate = () => {
    switch (activePeriod) {
      case '일간':
        setDate(getTomorrow(date));
        break;
      case '주간':
        setDate(getNextWeek(date));
        break;
      case '월간':
        setDate(getNextMonth(date));
        break;
      default:
        return date;
    }
  };

  // 영양소별 음식 아이콘
  const nutritionIcon = {
    탄수화물: <Carbohydrate />,
    단백질: <Protein />,
    지방: <Fat />,
  };

  const data = [
    { name: '탄수화물', value: 400 },
    { name: '단백질', value: 300 },
    { name: '지방', value: 300 },
  ];

  const nutrient = {
    kcal: 250,
    carbs: 45,
    sugar: 12,
    sweetener: 2,
    fiber: 8,
    protein: 15,
    fat: 8,
    satFat: 3,
    transFat: 0,
    unsatFat: 5,
    cholesterol: 25,
    sodium: 480,
    potassium: 320,
    caffeine: 95,
  };

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
        value='768'
        activePeriod={activePeriod}
        prevDate={handlePrevDate}
        nextDate={handleNextDate}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        {/* 탄단지 비율 차트 */}
        <PieCharts data={data} />
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
                <NutritionFood foodData={data}/>
              </React.Fragment>
            ))}
          </>
        )}
      </section>
    </main>
  );
}
