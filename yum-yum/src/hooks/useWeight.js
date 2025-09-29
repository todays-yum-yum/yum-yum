// 몸무게 입력 커스텀 훅
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveWeight } from '@/services/weightApi';
import { getUserWeightData } from '@/services/userApi';
import { useEffect, useState } from 'react';

export const useWeight = (userId, selectedDate) => {
  const queryClient = useQueryClient();
  // 날짜 선택
  const [selectedDateModalOpen, setSelectedDateModalOpen] = useState(false);
  const [selectedDateModal, setSelectedDateModal] = useState(selectedDate);

  // 사용자 데이터 불러오기(무게데이터만 가져옴)
  const userData = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserWeightData(userId),
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
  });

  // 체중 수정(저장)하기
  const saveWeightMutation = useMutation({
    mutationFn: ({ weight }) => saveWeight({ userId, weight, date: selectedDateModal }),
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
    userWeightData: userData.data, // 사용자 무게 데이터

    // 몸무게 저장 관련
    saveWeightMutation,

    // 날짜 선택 관련
    selectedDateModal,
    setSelectedDateModal,
    selectedDateModalOpen,
    setSelectedDateModalOpen,
  };
};

// 바깥 클릭 감지 훅
export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // ref가 아직 없거나, 클릭한 게 ref 내부라면 무시
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
