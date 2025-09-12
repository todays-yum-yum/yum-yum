// ai 리포트에서 사용될 식단 가져오는 훅

import { useQuery } from '@tanstack/react-query';
import { getSelectedData } from '../services/nutritionAnalysis';
import { parseMeals } from '../utils/mainDataParser';

export function useMeals(userId, selectedDate, type) {
  return useQuery({
    queryKey: ['aireport-meals', userId, selectedDate, type],
    queryFn: () => getSelectedData(userId, selectedDate, type),
    select: (rawMeals) => parseMeals(rawMeals),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
  });
}
