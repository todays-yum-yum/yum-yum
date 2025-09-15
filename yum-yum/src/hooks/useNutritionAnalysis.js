// AI Api 캐싱, 상태관리
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateNutritionAnalysis, fetchAIResultWithCache } from '../services/nutritionAnalysis';
import { generateDataHash } from '../utils/hashUtils';
import { getTodayKey } from '../utils/dateUtils';
import { hasExecutedInTimePeriod, markExecutedInTimePeriod } from '@/utils/localStorage';
import { useEffect, useState } from 'react';

export const useNutritionAnalysis = (userId, meals = {}, selectedDate, currentTimePeriod) => {
  const queryClient = useQueryClient();
  const dataHash = generateDataHash(meals);
  const today = getTodayKey(selectedDate);
  const periodKey = currentTimePeriod?.key;

  const queryKey = periodKey
    ? ['nutrition-analysis', today, periodKey, dataHash]
    : ['nutrition-analysis', 'invalid-time'];

  // 1) useQuery: enabled: false → 필요할 때만 수동 호출
  const query = useQuery({
    queryKey,
    queryFn: () => generateNutritionAnalysis(userId, meals),
    enabled: false,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (count, err) => count < 3 && err.type === 'RESOURCE_EXHAUSTED',
    retryDelay: (n) => Math.min(1000 * 2 ** n, 30_000),
  });

  // 2) “한 시간대당 한 번만 AI 생성” useEffect
  useEffect(() => {
    if (!meals.date || !periodKey) return;

    if (!hasExecutedInTimePeriod(today, periodKey, dataHash)) {
      query
        .refetch()
        .then(() => {
          markExecutedInTimePeriod(today, periodKey, dataHash);
        })
        .catch(console.error);
    }
    // meals.date, meals.type 만 deps 에 넣어야 객체 참조 변경으로 재실행되는 걸 방지
  }, [meals.date, meals.type, periodKey, today, dataHash, query]);

  // 3) “이미 캐시가 있으면 fetchAIResultWithCache” useEffect
  //    → 한번만 실행할 수 있게 플래그로 또 막아주자
  const isCached = queryClient.getQueryData(queryKey) !== undefined;
  const [didFetchCachedResult, setDidFetchCachedResult] = useState(false);

  useEffect(() => {
    // console.log(isCached, didFetchCachedResult);
    if (!hasExecutedInTimePeriod(today, periodKey, dataHash)) return; // 호출 한 적이 없으면 패스
    if (didFetchCachedResult) return; // 이미 한 번 불렀으면 패스

    setDidFetchCachedResult(true); // 플래그 세팅
    fetchAIResultWithCache(userId, { date: selectedDate, type: meals.type })
      .then((cachedRes) => {
        // 가져온 AI 메시지도 react-query 캐시에 함께 세팅
        queryClient.setQueryData(queryKey, cachedRes);
      })
      .catch(console.error);

    // meals.date, meals.type
  }, [isCached, didFetchCachedResult, userId, meals.date, meals.type, queryClient, queryKey]);

  return {
    ...query,
    dataHash,
    todayKey: today,
    periodKey,
    isCached,
  };
};
