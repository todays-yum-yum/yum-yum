import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../services/userApi';
import { differenceInDays } from 'date-fns';

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

  // 가입일로부터 날짜 계산
  const getDDays = (timestamp) => {
    const signUpDate = new Date(timestamp * 1000);
    const today = new Date();

    // console.log(signUpDate, today)

    return differenceInDays(today, signUpDate);
  };

  return {
    userName: userQuery.data?.name,
    goal: getGoalLabel(userQuery.data?.goals?.goal),
    targetWeight: Math.round((userQuery.data?.goals?.targetWeight ?? 0) * 10) / 10,
    targetExercise: getActivityTitle(userQuery.data?.goals?.targetExercise),
    createDays: getDDays(userQuery.data?.createdAt?.seconds),
    userLoading: userQuery.isLoading,
  };
};
