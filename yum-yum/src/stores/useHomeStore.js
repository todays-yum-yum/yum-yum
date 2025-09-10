// 메인화면에서 사용되는 데이터
import { create } from 'zustand';
import { calorieCalculator } from '../utils/calorieCalculator';

export const useHomeStore = create((set, get) => ({
  // 계산된 값들
  tdee: null,
  targetCalories: null,
  currentWeight: null,
  goalWeight: null, // 목표 무게

  // 호출 값들

  // UI 상태
  selectedDate: new Date().toISOString().split('T')[0],
  calendarOpen: false,
  onboardOpen: false,
  weightModalOpen: false,

  // 액션들
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCalendarOpen: (isOpen) => set({ calendarOpen: isOpen }),
  setOnboardOpen: (isOpen) => set({ onboardOpen: isOpen }),
  setWeightModalOpen: (isOpen) => set({ weightModalOpen: isOpen }),

  // 계산 액션들
  calcuateCalories: (userData) => {
    if (!userData) return;

    const { tdee, targetCalories, currentWeight, goalWeight } = calorieCalculator({
      weight: userData.weight,
      height: userData.height,
      gender: userData.gender,
      age: userData.age,
      excercise: userData.goals.targetExercise,
      goalWeight: userData.goals.targetWeight,
    });

    set({
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      currentWeight: currentWeight,
      goalWeight: goalWeight,
    });
  },

  // 초기화
  resetCalories: () => set({ tdee: null, targetCalories: null }),
}));
