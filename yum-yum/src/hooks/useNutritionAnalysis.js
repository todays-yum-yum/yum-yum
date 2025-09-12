// AI Api 캐싱, 상태관리
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateNutritionAnalysis } from '../services/nutritionAnalysis';
import { generateDataHash } from '../utils/hashUtils';
import { getTodayKey } from '../utils/dateUtils';
import { hasExecutedInTimePeriod, markExecutedInTimePeriod } from '@/utils/localStorage';
import { useEffect } from 'react';

export const useNutritionAnalysis = (meals, selectedDate, currentTimePeriod) => {
  const queryClient = useQueryClient();
  const dataHash = generateDataHash(meals);
  const today = getTodayKey(selectedDate);
  const periodKey = currentTimePeriod?.key;

  const queryKey = periodKey
    ? ['nutrition-analysis', today, periodKey, dataHash]
    : ['nutrition-analysis', 'invalid-time'];
  // React-Query 로 쿼리 정의 (enabled: false 로 두고, 직접 fetchQuery 로 실행)
  const query = useQuery({
    queryKey: queryKey,
    queryFn: () => generateNutritionAnalysis(meals[0]),
    enabled: false,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // meals가 바뀌거나 currentTimePeriod가 설정되면 이벤트 실행
  useEffect(() => {
    if (!meals || !periodKey) return; // 준비 안 된 상태는 패스

    const executed = hasExecutedInTimePeriod(today, periodKey, dataHash);
    // localStorage를 보고, 아직 호출된 적 없다면 호출
    if (!executed) {
      query
        .refetch()
        .then(() => {
          // 성공 시 localStroage에 추가 혹은 업데이트
          markExecutedInTimePeriod(today, periodKey, dataHash);
        })
        .catch((err) => {
          console.error('마킹 에러발생:', err);
        });
    }
  }, [queryClient, meals, today, periodKey, dataHash, query]);

  // react-query 캐시에 이미 들어있는지 검사
  const cachedData = queryClient.getQueryData(queryKey);
  const isCached = cachedData !== undefined;
  return {
    ...query,
    dataHash,
    todayKey: today,
    periodKey: currentTimePeriod?.key,
    isCached,
  };
};
