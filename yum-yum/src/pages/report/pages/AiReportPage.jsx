import React, { useEffect, useState } from 'react';
import ChartArea from '../components/ChartArea';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import { getTodayKey, parseDateString } from '@/utils/dateUtils';
import { callUserUid } from '@/utils/localStorage';

import { useMeals } from '@/hooks/useMeals';
import { useNutritionAnalysis } from '@/hooks/useNutritionAnalysis';

import { getCurrentTimePeriod } from '@/data/timePeriods';
import LightBulbIcon from '@/assets/icons/icon-light-bulb.svg?react';
import { useReportStore } from '@/stores/useReportStore';

import ReactMarkdown from 'react-markdown';
import { useQueryClient } from '@tanstack/react-query';

// const searchConfig = {
//   일간: 'daily',
//   주간: 'weekly',
//   월간: 'monthly',
// };

export default function AiReportPage({
  originDate,
  fullDate,
}) {
  const userId = callUserUid();

  const { searchType, nutrientionReport, setSearchType, setNutrientionReport, activePeriod } = useReportStore();

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

  const queryClient = useQueryClient();

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
  const { data, refetch, isLoading, isError: aiError, error: aiErrorMsg, } = useNutritionAnalysis(
    userId,
    meals,
    newDate,
    currentTimePeriod,
    searchType
  );
  
  // Lookbehind / Lookahead
  // 문장 부호 단위로 분리. 강조 구문은 분리안함
  // const splitMarkdownSentences = (text) => {
  //   return text.split(/(?<=[.!?])(?!\*)/);
  // };

  useEffect(() => {
    setSearchType(activePeriod);
  }, [activePeriod]);

  useEffect(() => {
    setNutrientionReport(data);
  }, [data]);

  // useEffect(() => {
  //   if(mealsError) {
  //     console.log(mealsErrorMsg)
  //   }
  // }, [mealsError])

  // useEffect(() => {
  //   console.log(aiErrorMsg)
  // }, [aiErrorMsg])

  return (
    <main className='flex flex-col h-full gap-7.5'>
      <ChartArea
        originDate={originDate}
        date={fullDate}
        unit='AI'
        value='1.2'
      >
        <section className='flex flex-col flex-1 align-items justify-center gap-2.5 w-90 pt-5 pb-5 pr-5 pl-5 rounded-2xl text-white bg-[var(--color-primary)] text-center'>
          <article className='flex flex-row items-center justify-center text-lg'>
            <LightBulbIcon /> AI 코치의 조언
          </article>
          <article className='text-xl'>
            <div className=''>
              {mealsLoading && <LoadingSpinner />}
              {mealsError && <span>식단 조회에 잠시 문제가 생겼어요. 다시 시도해 주시면 곧 확인하실 수 있습니다!</span>}
              {(isLoading && !mealsError) && <LoadingSpinner />}
              {(aiError && !mealsError && !isLoading && !mealsLoading && meals.mealBreakdown) && 
                <span>AI코치가 피드백을 하는 중에 잠시 문제가 생겼어요. 다시 시도해 주시면 곧 확인하실 수 있습니다!</span>
              }

              {/* 로딩/에러가 없을 때만 AI 결과 렌더링 */}

              {!(mealsLoading || mealsError || isLoading) && (!aiError || !meals.mealBreakdown) &&
                (nutrientionReport?.text ? (
                  nutrientionReport.text
                    .split('\n')
                    .filter(Boolean)
                    .map((sentence, idx) => (
                      <span key={idx} className='block mt-1 mb-2'>
                        <ReactMarkdown>{sentence.trim()}</ReactMarkdown>
                      </span>
                    ))
                ) : (
                  <span>아직 분석 결과가 준비되지 않았습니다. 오늘의 식단을 기록하면 AI 코치가 맞춤 피드백을 드려요!</span>
                ))}
            </div>
          </article>
        </section>
      </ChartArea>
    </main>
  );
}
