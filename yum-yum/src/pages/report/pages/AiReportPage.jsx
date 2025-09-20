import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';

import { getTodayKey, parseDateString } from '../../../utils/dateUtils';
import { useMeals } from './../../../hooks/useMeals';
import { useNutritionAnalysis } from './../../../hooks/useNutritionAnalysis';
import { getCurrentTimePeriod } from '../../../data/timePeriods';

import LightBulbIcon from '@/assets/icons/icon-light-bulb.svg?react';
import { callUserUid } from '@/utils/localStorage';

const searchConfig = {
  일간: 'daily',
  주간: 'weekly',
  월간: 'monthly',
};

const userId = callUserUid();
export default function AiReportPage({
  originDate,
  fullDate,
  activePeriod,
  setActivePeriod,
  prev,
  next,
  canMove,
}) {
  const parsedDate = parseDateString(originDate);

  const now = new Date();
  const newDate = new Date(
    parsedDate.year,
    parsedDate.month - 1,
    parsedDate.date,
    // 19,0,0,0, 
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );
  const selectedDate = getTodayKey(newDate);

  const currentTimePeriod = getCurrentTimePeriod(newDate);
  const [searchType, setSearchType] = useState(searchConfig[activePeriod]);
  const [nutritionResults, setNutritionResults] = useState({});

  // 1. Firestore 에서 식단 가져오기
  const {
    data: meals,
    isLoading: mealsLoading,
    isError: mealsError,
    error: mealsErrorMsg,
    dataUpdatedAt,
    status: mealsStatus,
  } = useMeals(userId, selectedDate, searchType);

  // 2. meals가 준비되면 AI 분석
  const { data, refetch, isLoading } = useNutritionAnalysis(
    userId,
    meals,
    newDate,
    currentTimePeriod,
  );

  const onPrevPeriod = () => {
    prev();
  };

  const onNextPeriod = () => {
    next();
  };

  useEffect(() => {
    setSearchType(searchConfig[activePeriod]);
    setNutritionResults([])
  }, [activePeriod]);

  useEffect(() => {
    setNutritionResults(data)
  }, [data])

  // useEffect(() => {
  //   console.log(nutritionResults)
  // },[nutritionResults])

  return (
    <main className='flex flex-col gap-7.5'>
      <ChartArea
        date={fullDate}
        period='일간'
        unit='AI'
        value='1.2'
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        <section className='flex flex-col gap-2.5 w-90 pt-5 pb-5 pr-5 pl-5 rounded-2xl text-white bg-[var(--color-primary)] text-center'>
          <article className='flex flex-row items-center justify-center text-lg'>
            <LightBulbIcon /> AI 코치의 조언
          </article>
          <article className='text-xl'>
            <p className=''>
              {mealsLoading && <span>식단 불러오는 중…</span>}
              {mealsError && <span>식단 조회 실패: 다시 시도해주세요</span>}
              {isLoading && <span>AI 결과 불러오는 중...</span>}

              {/* 로딩/에러가 없을 때만 AI 결과 렌더링 */}

              {!(mealsLoading || mealsError || isLoading) &&
                (nutritionResults?.text ? (
                  nutritionResults.text
                    .split('.')
                    .filter(Boolean)
                    .map((sentence, idx) => (
                      <span key={idx} className='block mt-1 mb-2'>
                        {sentence.trim()}.
                      </span>
                    ))
                ) : (
                  <span>아직 AI 코치의 분석 결과가 없습니다.</span>
                ))}
            </p>
          </article>
        </section>
      </ChartArea>
    </main>
  );
}
