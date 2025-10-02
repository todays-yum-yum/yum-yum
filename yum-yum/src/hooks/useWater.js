import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  addWaterIntake,
  getWaterIntake,
  getWaterSettings,
  saveWaterSettings,
} from '@/services/waterApi';
import toast from 'react-hot-toast';

export function useWaterIntake(userId, selectedDate) {
  const queryClient = useQueryClient();
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  // 수분 섭취량 조회
  const waterIntakeQuery = useQuery({
    queryKey: ['waterIntake', userId, formattedDate],
    queryFn: () => getWaterIntake(userId, formattedDate),
    enabled: !!userId && !!selectedDate,
    select: (data) => data ?? { dailyTotal: 0 },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 수분 섭취량 설정 조회
  const waterSettingsQuery = useQuery({
    queryKey: ['waterSettings', userId],
    queryFn: () => getWaterSettings(userId),
    enabled: !!userId,
    select: (data) => data ?? { oneTimeIntake: 200, targetIntake: 1500 },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 수분 섭취량 기록
  const addWaterIntakeMutation = useMutation({
    mutationFn: ({ date, amount }) => addWaterIntake(userId, date, amount),
    onSuccess: (_, variables) => {
      toast.success('기록이 완료 되었어요!');
      queryClient.invalidateQueries(['waterIntake', userId, variables.date]);
      queryClient.invalidateQueries(['daily-water-data', userId]);
    },
    onError: (error) => {
      toast.error('수분 기록 실패');
      console.error('수분 기록 에러: ', error);
    },
  });

  // 수분 섭취량 설정 수정
  const saveWaterSettingsMutation = useMutation({
    mutationFn: ({ oneTimeIntake, targetIntake }) =>
      saveWaterSettings(userId, oneTimeIntake, targetIntake),
    onSuccess: () => {
      toast.success('설정 저장 완료!');
      queryClient.invalidateQueries(['waterSettings', userId]);
      queryClient.invalidateQueries(['daily-water-data', userId]);
    },
    onError: (error) => {
      toast.error('수분 섭취량 설정 실패');
      console.error('수분 섭취량 설정 에러: ', error);
    },
  });

  return {
    waterData: waterIntakeQuery.data,
    waterLoading: waterIntakeQuery.isLoading,
    waterError: waterIntakeQuery.isError,

    waterSettings: waterSettingsQuery.data,
    settingsLoading: waterSettingsQuery.isLoading,
    settingsError: waterSettingsQuery.isError,

    addWaterIntakeMutation,
    saveWaterSettingsMutation,
  };
}
