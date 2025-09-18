// main페이지 데이터 상태, 호출 훅
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData } from '../services/userApi';
import { getDailyData } from '../services/dailyDataApi';

export const usePageData = (userId, selectedDate) => {
  // 선택된 날짜의 물, 식사 데이터
  const dailyDataQuery = useQuery({
    queryKey: ['dailyData', userId, selectedDate],
    queryFn: () => getDailyData(userId, selectedDate),
    select: (resp) => resp.data,
    staleTime: 1 * 60 * 1000, // 1분
    // staleTime: 30 * 1000, // 30초
    enabled: !!userId && !!selectedDate,
  });

  // 수동 갱신 함수
  const refetchDaily = () => dailyDataQuery.refetch();

  return {
    // 일일 데이터
    dailyData: dailyDataQuery.data,
    dailyLoading: dailyDataQuery.isLoading,

    // 수동 갱신 (일일 데이터)
    refetchDaily,
  };
};
