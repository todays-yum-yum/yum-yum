// 몸무게 입력 커스텀 훅
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveWeight } from '@/services/weightApi';
import { getUserWeightData } from '@/services/userApi';
import { useHomeStore } from '@/stores/useHomeStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const useWeightModal = (userId, selectedDate) => {
  const { weightModalOpen, setWeightModalOpen } = useHomeStore();
  const {
    selectedDateModal,
    setSelectedDateModal,
    selectedDateModalOpen,
    setSelectedDateModalOpen,
    saveWeightMutation,
  } = useWeight(userId, selectedDate);
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: { weight: '' },
    mode: 'onSubmit',
  });

  const open = () => setWeightModalOpen(true);
  const close = () => setWeightModalOpen(false);

  const onSubmit = handleSubmit(async (data) => {
    const p = saveWeightMutation.mutateAsync({ weight: +data.weight, date: selectedDateModal });
    await toast.promise(p, {
      loading: '저장하는 중...',
      success: (response) => {
        setWeightModalOpen(false);
        reset();
        return response?.message || '몸무게가 성공적으로 저장되었습니다!';
      },
      error: (error) => {
        return error?.message || '몸무게 저장에 실패했습니다.';
      },
    });
    reset();
    close();
  });

  return {
    weightModalOpen,
    open,
    close,
    selectedDateModal,
    setSelectedDateModal,
    selectedDateModalOpen,
    setSelectedDateModalOpen,
    register,
    onSubmit,
    formState,
  };
};

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
