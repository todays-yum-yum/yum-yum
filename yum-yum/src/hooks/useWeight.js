// 몸무게 입력 커스텀 훅
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveWeight } from '@/services/weightApi';
import { getUserData } from '@/services/userApi';

export const useWeight = (userId) => {
  const queryClient = useQueryClient();

  // 사용자 데이터 불러오기
  const userData = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserData(userId),
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
  });

  // 체중 수정(저장)하기
  const saveWeightMutation = useMutation({
    mutationFn: ({ weight }) => saveWeight({ userId, weight }),
    onSuccess: (response) => {
      if (response.success) {
        // 사용자 데이터 쿼리 무효화하여 새로고침
        queryClient.invalidateQueries({
          queryKey: ['user', userId],
        });
        // 옵티미스틱 업데이트 (즉시 UI 반영)
        queryClient.setQueryData(['user', userId], (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              weight: response.data.weight,
              updatedAt: new Date(),
            };
          }
          return oldData;
        });
      }
    },
    onError: (error) => {
      console.error('몸무게 저장 에러: ', error);
    },
  });

  return {
    // 사용자 데이터 관련
    currentWeight: userData.data?.weight,
    targetWeight: userData.data?.goals?.targetWeight,
    isLoading: userData.isLoading,
    isError: userData.isError,
    error: userData.error,
    userData: userData.data, // 전체 사용자 데이터

    // 몸무게 저장 관련
    saveWeightMutation,
  };
};
