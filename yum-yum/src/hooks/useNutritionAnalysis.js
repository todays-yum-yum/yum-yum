// AI Api 캐싱, 상태관리
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateNutritionAnalysis, fetchAIResultWithCache } from '../services/nutritionAnalysis';
import { generateDataHash } from '../utils/hashUtils';
import { getTodayKey } from '../utils/dateUtils';
import { hasExecutedInTimePeriod, markExecutedInTimePeriod } from '@/utils/localStorage';

export const useNutritionAnalysis = (userId, meals = {}, selectedDate, currentTimePeriod) => {
  const queryClient = useQueryClient();
  const dataHash = generateDataHash(meals);
  const today = getTodayKey(selectedDate);
  const periodKey = currentTimePeriod?.key;

  const queryKey = periodKey
    ? ['nutrition-analysis', today, periodKey, dataHash]
    : ['nutrition-analysis', 'invalid-time'];

  const isCached = queryClient.getQueryData(queryKey) !== undefined;

  // 1) useQuery: enabled: false → 필요할 때만 수동 호출
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // 1. 같은 시간대에 이미 API를 실행했으면 다시 생성하지 않고
      // 로컬스토리지 플래그만 보고 fetchAIResultWithCache 로 조회
      const alreadyRun = hasExecutedInTimePeriod(today, periodKey, dataHash);
      // 2. 가능하면 우선 DB cache 조회
      if (alreadyRun) {
        const cached = await fetchAIResultWithCache(userId, {
          date: selectedDate,
          type: meals.type,
        });
        // DB에 성공적으로 들어있는 데이터가 있으면 리턴
        if (cached?.success) {
          return cached;
        }
      }

      // 3. DB에 없거나 아직 한번도 안 실행한 경우 AI 생성
      const fresh = await generateNutritionAnalysis(userId, meals);
      // 로컬스토리지에 이 시간대 생성완료 표시
      // markExecutedInTimePeriod(today, periodKey, dataHash);
      return fresh;
    },
    // enabled: false,
    enabled: !!periodKey && !!meals.date,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: (count, err) => count < 3 && err.type === 'RESOURCE_EXHAUSTED',
    retryDelay: (n) => Math.min(1000 * 2 ** n, 30_000),
    onSuccess: (data) => {
      // generateNutritionAnalysis 에서 성공적으로 생성된 데이터가 오면
      // react-query 캐시에 함께 세팅
      if (!hasExecutedInTimePeriod(today, periodKey, dataHash)) {
        markExecutedInTimePeriod(today, periodKey, dataHash);
      }
    },
  });

  return {
    ...query,
    dataHash,
    todayKey: today,
    periodKey,
    isCached,
  };
};

// // AI Api 캐싱, 상태관리
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { generateNutritionAnalysis, fetchAIResultWithCache } from '../services/nutritionAnalysis';
// import { generateDataHash } from '../utils/hashUtils';
// import { getTodayKey } from '../utils/dateUtils';
// import { hasExecutedInTimePeriod, markExecutedInTimePeriod } from '@/utils/localStorage';
// import { useEffect, useState } from 'react';

// export const useNutritionAnalysis = (userId, meals = {}, selectedDate, currentTimePeriod) => {
//   const queryClient = useQueryClient();
//   const dataHash = generateDataHash(meals);
//   const today = getTodayKey(selectedDate);
//   const periodKey = currentTimePeriod?.key;

//   const queryKey = periodKey
//     ? ['nutrition-analysis', today, periodKey, dataHash]
//     : ['nutrition-analysis', 'invalid-time'];

//   // 1) useQuery: enabled: false → 필요할 때만 수동 호출
//   const query = useQuery({
//     queryKey,
//     queryFn: () => generateNutritionAnalysis(userId, meals),
//     enabled: false,
//     staleTime: 1000 * 60 * 60 * 24,
//     gcTime: 1000 * 60 * 60 * 24 * 7,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     retry: (count, err) => count < 3 && err.type === 'RESOURCE_EXHAUSTED',
//     retryDelay: (n) => Math.min(1000 * 2 ** n, 30_000),
//   });

//   // 2) “한 시간대당 한 번만 AI 생성” useEffect
//   useEffect(() => {
//     if (!meals.date || !periodKey) return;
//     console.log('useQuery key:', queryKey);
//     console.log('cache data for key:', queryClient.getQueryData(queryKey));
//     if (!hasExecutedInTimePeriod(today, periodKey, dataHash)) {
//       query
//         .refetch()
//         .then(() => {
//           markExecutedInTimePeriod(today, periodKey, dataHash);
//         })
//         .catch(console.error);
//     }
//     // meals.date, meals.type 만 deps 에 넣어야 객체 참조 변경으로 재실행되는 걸 방지
//   }, [meals.date, meals.type, periodKey, today, dataHash, query, queryClient, queryKey]);

//   // 3) “이미 캐시가 있으면 fetchAIResultWithCache” useEffect
//   //    → 한번만 실행할 수 있게 플래그로 또 막아주자
//   const isCached = queryClient.getQueryData(queryKey) !== undefined;
//   const [didFetchCachedResult, setDidFetchCachedResult] = useState(false);

//   useEffect(() => {
//     console.log(isCached, didFetchCachedResult);
//     if (!hasExecutedInTimePeriod(today, periodKey, dataHash)) return; // 호출 한 적이 없으면 패스
//     if (didFetchCachedResult) return; // 이미 한 번 불렀으면 패스

//     setDidFetchCachedResult(true); // 플래그 세팅
//     fetchAIResultWithCache(userId, { date: selectedDate, type: meals.type })
//       .then((cachedRes) => {
//         // 가져온 AI 메시지도 react-query 캐시에 함께 세팅
//         queryClient.setQueryData(queryKey, cachedRes);
//       })
//       .catch(console.error);

//     // meals.date, meals.type
//   }, [isCached, didFetchCachedResult, userId, meals.date, meals.type, queryClient, queryKey]);

//   return {
//     ...query,
//     dataHash,
//     todayKey: today,
//     periodKey,
//     isCached,
//   };
// };
