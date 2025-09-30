import { useMutation, useQueryClient } from '@tanstack/react-query';
import { firestore } from '@/services/firebase';
import { saveMeal } from '@/services/mealApi';
import { deleteField, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const useDailyMeal = (userId, date) => {
  const queryClient = useQueryClient();

  // 식단 저장
  const saveDailyMeal = useMutation({
    mutationFn: async ({ type, meals }) => {
      await saveMeal(userId, date, type, meals);
    },
    onSuccess: () => {
      toast.success('식단 기록이 완료 되었어요!');
      queryClient.invalidateQueries({ queryKey: ['dailyData', userId, date] });
    },
    onError: (error) => {
      toast.error('식단 기록 실패!');
      console.error('식단 기록 에러: ', error);
    },
  });

  // 리스트 0개면 삭제
  const deleteDailyMeal = useMutation({
    mutationFn: async (type) => {
      const mealRef = doc(firestore, 'users', userId, 'meal', date);
      await updateDoc(mealRef, {
        [`meals.${type}`]: deleteField(),
      });
    },
    onSuccess: () => {
      toast.success('식단 기록이 삭제 되었어요!');
      queryClient.invalidateQueries({ queryKey: ['dailyData', userId, date] });
    },
    onError: (error) => {
      toast.error('식단 삭제 실패!');
      console.error('식단 삭제 에러: ', error);
    },
  });

  return { saveDailyMeal, deleteDailyMeal };
};
