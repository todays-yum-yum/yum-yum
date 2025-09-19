import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../services/userApi';
import {
  getEndDateOfMonth,
  getEndDateOfWeek,
  getStartDateOfMonth,
  getStartDateOfWeek,
  parseDateString,
} from '../utils/dateUtils';
import { getWeeklyData } from '../services/weeklyDataApi';
import { getMonthlyData } from '../services/monthlyDataApi';
import { getDailyData } from '../services/dailyDataApi';
import { getTodayKey } from './../utils/dateUtils';

export const useDailyReportData = (userId, selectedDate) => {
  // 단위 기간 범위 설정
  const day = parseDateString(selectedDate);

  const newDate = getTodayKey(new Date(day.year, day.month - 1, day.date));

  const dailyDataQuery = useQuery({
    queryKey: ['mealData', userId, selectedDate, 'daily'],
    queryFn: () => getDailyData(userId, newDate),
    select: (response) => response.data,
    staleTime: 0.5 * 60 * 1000, 
    enabled: !!userId && !!selectedDate,
  });

  return {
    // 데이터
    dailyData: dailyDataQuery.data,
    dailyLoading: dailyDataQuery.isLoading,

    // 전체 로딩 상태
    isLoading: dailyDataQuery.isLoading,
  };
};

export const useWeeklyReportData = (userId, selectedDate) => {
  // 단위 기간 범위 설정
  const startDay = parseDateString(getStartDateOfWeek(selectedDate));
  const endDay = parseDateString(getEndDateOfWeek(selectedDate));

  const startOfDay = getTodayKey(new Date(startDay.year, startDay.month - 1, startDay.date));
  const endOfDay = getTodayKey(new Date(endDay.year, endDay.month - 1, endDay.date + 1));


  const weeklyDataQuery = useQuery({
    queryKey: ['mealData', userId, selectedDate, 'weekly'],
    queryFn: () => getWeeklyData(userId, startOfDay, endOfDay),
    select: (response) => response.data,
    staleTime: 0.5 * 60 * 1000,
    enabled: !!userId && !!selectedDate,
  });

  return {
    // 데이터
    weeklyData: weeklyDataQuery.data,
    weeklyLoading: weeklyDataQuery.isLoading,

    // 전체 로딩 상태
    isLoading: weeklyDataQuery.isLoading,
  };
};

export const useMonthlyReportData = (userId, selectedDate) => {
  // 단위 기간 범위 설정
  const startDay = parseDateString(getStartDateOfMonth(selectedDate));
  const endDay = parseDateString(getEndDateOfMonth(selectedDate));

  const startOfDay = getTodayKey(new Date(startDay.year, startDay.month - 1, startDay.date));
  const endOfDay = getTodayKey(new Date(endDay.year, endDay.month - 1, endDay.date + 1));

  const monthlyDataQuery = useQuery({
    queryKey: ['mealData', userId, selectedDate, 'monthly'],
    queryFn: () => getMonthlyData(userId, startOfDay, endOfDay),
    select: (response) => response.data,
    staleTime: 0.5 * 60 * 1000,
    enabled: !!userId && !!selectedDate,
  });
  
  return {
    // 데이터
    monthlyData: monthlyDataQuery.data,
    monthlyLoading: monthlyDataQuery.isLoading,

    // 전체 로딩 상태
    isLoading:  monthlyDataQuery.isLoading,
  };
};
