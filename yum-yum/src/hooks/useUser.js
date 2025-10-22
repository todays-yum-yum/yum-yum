// 사용자 데이터 쿼리 훅
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../services/userApi';
import { useHomeStore } from '../stores/useHomeStore';
import { useWeightLog } from './useWeight';

export const useUserData = (userId) => {
  // 사용자 데이터 불러오기
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserData(userId),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // 10분
    enabled: !!userId, // userId가 있을 때만 실행
  });

  return {
    userData: userQuery.data,
    userLoading: userQuery.isLoading,
  };
};

export const useHomeUserHook = (userId, selectedDate) => {
  const { calcuateCalories, setWeightLogs } = useHomeStore();
  const { userData } = useUserData(userId);
  const { weight, isExacDate, displayText } = useWeightLog(userId, selectedDate);

  useEffect(() => {
    if (userData) {
      calcuateCalories(userData, weight);
      setWeightLogs({ isExacDate: isExacDate, displayText: displayText });
    }
  }, [userData, weight, calcuateCalories]);

  return {
    userData,
  };
};
