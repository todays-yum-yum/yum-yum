import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCustomFoods, addCustomFood, deleteCustomFood } from '@/services/customFoodsApi';
import toast from 'react-hot-toast';

export const useCustomFoods = (userId) => {
  const queryClient = useQueryClient();

  // 직접 등록 리스트 불러오기
  const customFoodData = useQuery({
    queryKey: ['customFoods', userId],
    queryFn: () => getCustomFoods(userId),
    enabled: !!userId,
    select: (data) => data ?? [],
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 직접 등록
  const addFoodMutation = useMutation({
    mutationFn: (newFood) => addCustomFood(userId, newFood),
    onSuccess: () => {
      toast.success('등록 되었어요!');
      queryClient.invalidateQueries({ queryKey: ['customFoods', userId] });
    },
    onError: (error) => {
      toast.error('직접 등록 실패!');
      console.error('직접 등록 에러: ', error);
    },
  });

  // 삭제
  const deleteFoodMutation = useMutation({
    mutationFn: (foodId) => deleteCustomFood(userId, foodId),
    onSuccess: () => {
      toast.success('삭제 되었어요!');
      queryClient.invalidateQueries({ queryKey: ['customFoods', userId] });
    },
    onError: (error) => {
      toast.error('삭제 실패!');
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
