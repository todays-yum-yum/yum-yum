import { useQuery } from '@tanstack/react-query';
import { getRecentFoods } from '@/services/FrequentFoodsApi';

export const useRecentFoods = (userId) => {
  const recentFoodData = useQuery({
    queryKey: ['recentFoods', userId],
    queryFn: () => getRecentFoods(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
    select: (data) => data ?? [],
  });

  return {
    foodItems: recentFoodData.data ?? [],
    isLoading: recentFoodData.isLoading,
    isError: recentFoodData.isError,
  };
};
