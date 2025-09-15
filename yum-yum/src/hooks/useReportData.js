import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../services/userApi';
import { query } from 'firebase/firestore';
import { getEndDateOfMonth, getEndDateOfWeek, getStartDateOfMonth, getStartDateOfWeek, parseDateString } from '../utils/dateUtils';
import { getWeeklyData } from '../services/weeklyDataApi';
import { normalizeDataRange } from './../utils/reportDataParser';
import { getMonthlyData } from '../services/monthlyDataApi';

export const useWeeklyReportData = (userId, selectedDate) => {
  // 단위 기간 범위 설정
  const startDay = parseDateString(getStartDateOfWeek(selectedDate));
  const endDay = parseDateString(getEndDateOfWeek(selectedDate));

  const startOfDay = new Date(startDay.year, startDay.month - 1, startDay.date);
  const endOfDay = new Date(endDay.year, endDay.month - 1, endDay.date);

  // 사용자 데이터 불러오기
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserData(userId),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // 10분
    enabled: !!userId, // userId가 있을 때만 실행
  });

  const weeklyDataQuery = useQuery({
    queryKey: ['mealData', userId, selectedDate, 'weekly'],
    queryFn: () => getWeeklyData(userId, startOfDay, endOfDay),
    select: (response) => response.data,
    staleTime: 1 * 60 * 1000, // 1분
    enabled: !!userId && !!selectedDate,
  });

  return {
    // 사용자 데이터
    userData: userQuery.data,
    userLoading: userQuery.isLoading,

    // 데이터
    weeklyData: weeklyDataQuery.data,
    weeklyLoading: weeklyDataQuery.isLoading,

    // 전체 로딩 상태
    isLoading: userQuery.isLoading || weeklyDataQuery.isLoading,
  };
};


export const useMonthlyReportData = (userId, selectedDate) => {
  // 단위 기간 범위 설정
  const startDay = parseDateString(getStartDateOfMonth(selectedDate));
  const endDay = parseDateString(getEndDateOfMonth(selectedDate));

  const startOfDay = new Date(startDay.year, startDay.month - 1, startDay.date);
  const endOfDay = new Date(endDay.year, endDay.month - 1, endDay.date);

  // 사용자 데이터 불러오기
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserData(userId),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // 10분
    enabled: !!userId, // userId가 있을 때만 실행
  });

  const monthlyDataQuery = useQuery({
    queryKey: ['mealData', userId, selectedDate, 'monthly'],
    queryFn: () => getMonthlyData(userId, startOfDay, endOfDay),
    select: (response) => response.data,
    staleTime: 1 * 60 * 1000, // 1분
    enabled: !!userId && !!selectedDate,
  });
  
  return {
    // 사용자 데이터
    userData: userQuery.data,
    userLoading: userQuery.isLoading,

    // 데이터
    monthlyData: monthlyDataQuery.data,
    monthlyLoading: monthlyDataQuery.isLoading,

    // 전체 로딩 상태
    isLoading: userQuery.isLoading || monthlyDataQuery.isLoading,
  };
};