// 사용자 데이터 쿼리 훅
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../services/userApi';

export const useUserData = (userId, selectedDate) => {
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
