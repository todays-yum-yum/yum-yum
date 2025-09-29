import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCustomFoods, addCustomFood, deleteCustomFood } from '@/services/customFoodsApi';

export const useCustomFoods = (userId) => {
  const queryClient = useQueryClient();

  // 직접 등록 리스트 불러오기
  const customFoodData = useQuery({
    queryKey: ['customFoods', userId],
    queryFn: () => getCustomFoods(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10분
    select: (data) => data ?? [],
  });

  // 직접 등록
  const addFoodMutation = useMutation({
    mutationFn: (newFood) => addCustomFood(userId, newFood),
    onSuccess: () => {
      // 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['customFoods', userId] });
    },
    onError: (error) => {
      console.error('직접 등록 에러: ', error);
    },
  });

  // 삭제
  const deleteFoodMutation = useMutation({
    mutationFn: (foodId) => deleteCustomFood(userId, foodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFoods', userId] });
    },
    onError: (error) => {
      console.error('삭제 에러: ', error);
    },
  });

  return {
    foodItems: customFoodData.data ?? [],
    isLoading: customFoodData.isLoading,
    isError: customFoodData.isError,

    addFoodMutation,
    deleteFoodMutation,
  };
};
