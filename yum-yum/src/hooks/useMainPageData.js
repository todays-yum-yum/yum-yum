// main페이지 데이터 상태, 호출 훅
import { useQuery } from '@tanstack/react-query';
import { getDailyData, getDailyMeal, getDailyWater } from '@/services/dailyDataApi';
import { getTodayKey } from '@/utils/dateUtils';
import { useHomeStore } from '@/stores/useHomeStore';
import { useEffect } from 'react';
import { useHomeUserHook } from './useUser';

export const usePageData = (userId, selectedDate) => {
  const { setWaterData, setMealData } = useHomeStore();
  const { waterData: waterOrigin } = useDailyWaterData(userId, selectedDate);
  const { mealData: mealOrigin } = useDailyMealData(userId, selectedDate);
  const { userData } = useHomeUserHook(userId);

  useEffect(() => {
    if (waterOrigin) setWaterData(waterOrigin, userData);
  }, [waterOrigin, setWaterData]);

  useEffect(() => {
    if (mealOrigin) setMealData(mealOrigin);
  }, [mealOrigin, setMealData]);

  // store 에서 꺼내서 사용
  const { waterData, mealData, targetCalories, currentWeight, goalWeight } = useHomeStore();
  return {
    waterData,
    mealData,
    targetCalories,
    currentWeight,
    goalWeight,
    mealDataOrigin: mealOrigin?.mealData,
  };
};

// 선택한 날 하루의 전체 식단 데이터
export const useDailyMealData = (userId, selectedDate) => {
  const dailyMealData = useQuery({
    queryKey: ['daily-meal-data', userId, getTodayKey(selectedDate)],
    queryFn: () => getDailyMeal(userId, selectedDate),
    staleTime: 5 * 60 * 1000, // 5분
    enabled: !!userId && !!selectedDate,
  });

  const refetchMealData = () => dailyMealData.refetch();

  return {
    mealData: dailyMealData.data,
    mealLoading: dailyMealData.isLoading,
    mealError: dailyMealData.error,

    refetchMealData,
  };
};

// 선택한 날 하루의 전체 물 데이터
export const useDailyWaterData = (userId, selectedDate) => {
  const dailyWaterData = useQuery({
    queryKey: ['daily-water-data', userId, getTodayKey(selectedDate)],
    queryFn: () => getDailyWater(userId, selectedDate),
    staleTime: 5 * 60 * 1000, // 5분
    enabled: !!userId && !!selectedDate,
  });
  const refetchWaterData = () => dailyWaterData.refetch();

  return {
    waterData: dailyWaterData.data,
    waterLoading: dailyWaterData.isLoading,
    waterError: dailyWaterData.error,

    refetchWaterData,
  };
};
