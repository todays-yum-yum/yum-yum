// ai 리포트에서 사용될 식단 가져오는 훅

import { useQuery } from '@tanstack/react-query';
import { getSelectedData } from '../services/nutritionAnalysis';
import { parseMeals } from '../utils/mainDataParser';
import { format } from 'date-fns';

export function useMeals(userId, selectedDate, type) {
  return useQuery({
    queryKey: ['aireport-meals', userId, format(selectedDate, 'yyyy-MM-dd'), type],
    queryFn: () => getSelectedData(userId, selectedDate, type),
    select: (rawMeals) => {
      if (rawMeals.error) {
        //식단 호출 에러시 그냥 리턴
        return;
      }
      return parseMeals(rawMeals, selectedDate);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!userId && !!selectedDate && !!type,
  });
}
