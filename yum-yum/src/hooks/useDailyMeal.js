import { useMutation, useQueryClient } from '@tanstack/react-query';
import { firestore } from '@/services/firebase';
import { saveMeal, totalDailySummary } from '@/services/mealApi';
import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
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
      queryClient.invalidateQueries({ queryKey: ['daily-meal-data', userId, date] });
    },
    onError: (error) => {
      toast.error('식단 기록 실패!');
      console.error('식단 기록 에러: ', error);
    },
  });

  // 식단 수정
  const deleteDailyMeal = useMutation({
    mutationFn: async (type) => {
      const mealRef = doc(firestore, 'users', userId, 'meal', date);
      const snapShot = await getDoc(mealRef);

      if (!snapShot.exists()) return;
      const data = snapShot.data();
      const updatedMeals = { ...(data.meals || {}) };

      // 해당 type 삭제
      delete updatedMeals[type];

      // 모든 끼니가 비어있으면 문서 삭제함
      if (Object.keys(updatedMeals).length === 0) {
        await deleteDoc(mealRef);
      } else {
        // 일부만 삭제되면 dailySummary 재계산
        await updateDoc(
          mealRef,
          {
            [`meals.${type}`]: deleteField(),
            dailySummary: totalDailySummary(Object.values(updatedMeals).flat()),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    },
    onSuccess: () => {
      toast.success('식단 기록이 삭제 되었어요!');
      queryClient.invalidateQueries({ queryKey: ['daily-meal-data', userId, date] });
    },
    onError: (error) => {
      toast.error('식단 삭제 실패!');
      console.error('식단 삭제 에러: ', error);
    },
  });

  return { saveDailyMeal, deleteDailyMeal };
};
