// main페이지 데이터 상태, 호출 훅
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData } from '../services/userApi';
import { getDailyData } from '../services/dailyDataApi';

export const usePageData = (userId, selectedDate) => {
  // 사용자 데이터 불러오기
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserData(userId),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // 10분
    enabled: !!userId, // userId가 있을 때만 실행
  });

  // 선택된 날짜의 물, 식사 데이터
  const dailyDataQuery = useQuery({
    queryKey: ['dailyData', userId, selectedDate],
    queryFn: () => getDailyData(userId, selectedDate),
    select: (resp) => resp.data,
    // staleTime: 1 * 60 * 1000, // 1분
    staleTime: 30 * 1000, // 30초
    enabled: !!userId && !!selectedDate,
  });

  return {
    // 사용자 데이터
    userData: userQuery.data,
    userLoading: userQuery.isLoading,

    // 일일 데이터
    dailyData: dailyDataQuery.data,
    dailyLoading: dailyDataQuery.isLoading,

    // 전체 로딩 상태
    isLoading: userQuery.isLoading || dailyDataQuery.isLoading,
  };
};
