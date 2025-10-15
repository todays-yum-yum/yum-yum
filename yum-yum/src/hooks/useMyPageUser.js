import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../services/userApi';

const goalsOption = [
  { value: '', label: '목표 선택' },
  { value: 'loss', label: '체중 감량' },
  { value: 'gain', label: '체중 증가' },
  { value: 'maintain', label: '건강증진 및 유지' },
];

// 활동량
const activityLevel = [
  { value: 'none', title: '운동 안함' },
  { value: 'light', title: '가벼운 운동' },
  { value: 'moderate', title: '적당한 운동' },
  { value: 'intense', title: '격렬한 운동' },
];

export const useMyPageUserData = (userId) => {

  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserData(userId),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
    enabled: !!userId, 
  });

    // 목표
  const getGoalLabel = (value) => {
    return goalsOption.find((option) => option.value === value)?.label || '목표';
  };

  // 활동량
  const getActivityTitle = (value) => {
    return activityLevel.find((level) => level.value === value)?.title || '활동량';
  };

  return {
    userName: userQuery.data?.name,
    goal: getGoalLabel(userQuery.data?.goals?.goal),
    targetWeight: userQuery.data?.goals?.targetWeight,
    targetExercise: getActivityTitle(userQuery.data?.goals?.targetExercise),
    createAt: userQuery.data?.createdAt?.seconds,
    userLoading: userQuery.isLoading,
  };
};