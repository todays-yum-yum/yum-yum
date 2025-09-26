// 음식 검색한 데이터 캐싱

import { useQuery } from '@tanstack/react-query';
import { fetchNutritionData } from '../services/searchFoodApi';

export const useSearchFoodData = (searchKeyword) => {
  const searchFoodDataQuery = useQuery({
    queryKey: ['searchFoodData', searchKeyword],
    queryFn: () => fetchNutritionData(searchKeyword),
    select: (data) => removeDuplicateFoods(data), // 중복 키 제거 함수 적용
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

// 검색 한 데이터 중복 키 제거
const removeDuplicateFoods = (foods) => {
  const foodCd = new Set();
  const uniqueFoods = foods.filter((food) => {
    if (foodCd.has(food.id)) {
      return false;
    }
    foodCd.add(food.id);
    return true;
  });
  return uniqueFoods;
};
