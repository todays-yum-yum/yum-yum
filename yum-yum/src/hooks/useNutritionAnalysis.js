// AI Api 캐싱, 상태관리
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateNutritionAnalysis, fetchAIResultWithCache } from '../services/nutritionAnalysis';
import { generateDataHash } from '../utils/hashUtils';
import { getTodayKey } from '../utils/dateUtils';
import { hasExecutedInTimePeriod, markExecutedInTimePeriod } from '@/utils/localStorage';

export const useNutritionAnalysis = (userId, meals = {}, selectedDate, currentTimePeriod, searchType) => {
  const queryClient = useQueryClient();
  const dataHash = generateDataHash(meals);
  const today = getTodayKey(selectedDate);
  const periodKey = currentTimePeriod?.key;

  const queryKey = periodKey
    ? ['nutrition-analysis', today, periodKey, dataHash, searchType]
    : ['nutrition-analysis', 'invalid-time'];

  const isCached = queryClient.getQueryData(queryKey) !== undefined;

  // 1) useQuery: enabled: false → 필요할 때만 수동 호출
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // 1. 가능하면 우선 DB cache 조회
      const cached = await fetchAIResultWithCache(
        userId,
        {
          date: selectedDate,
          type: meals.type,
        },
        dataHash,
      );
      // DB에 성공적으로 들어있는 데이터가 있으면 리턴
      if (cached?.success) {
        return cached;
      }

      console.log('db에 없거나 아직 한번도 안 실행한 경우 AI 생성');
      // 3. DB에 없거나 아직 한번도 안 실행한 경우 AI 생성
      const fresh = await generateNutritionAnalysis(userId, meals, dataHash);
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
