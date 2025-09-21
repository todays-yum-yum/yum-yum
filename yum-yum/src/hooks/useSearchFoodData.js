// 음식 검색한 데이터 캐싱

import { useQuery } from '@tanstack/react-query';
import { fetchNutritionData } from '../services/searchFoodApi';

export const useSearchFoodData = (searchKeyword) => {
  const searchFoodDataQuery = useQuery({
    queryKey: ['searchFoodData', searchKeyword],
    queryFn: () => fetchNutritionData(searchKeyword),
    staleTime: 60 * 60 * 1000,
    enabled: !!searchKeyword,
  });

  return {
    searchData: searchFoodDataQuery.data,
    isLoading: searchFoodDataQuery.isLoading,
    isError: searchFoodDataQuery.isError,
    refetch: searchFoodDataQuery.refetch,
  };
};
