import { useQuery } from '@tanstack/react-query';
import { getRecentFoods } from '@/services/frequentFoodsApi';

export const useRecentFoods = (userId) => {
  const recentFoodData = useQuery({
    queryKey: ['recentFoods', userId],
    queryFn: () => getRecentFoods(userId),
    enabled: !!userId,
    select: (data) => data ?? [],
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    foodItems: recentFoodData.data ?? [],
    isLoading: recentFoodData.isLoading,
    isError: recentFoodData.isError,
  };
};
