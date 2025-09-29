// 메인화면에서 사용되는 데이터
import { create } from 'zustand';
import { calorieCalculator } from '../utils/calorieCalculator';
import { normalizerMeal, normalizerWater } from '../utils/mainDataParser';
import { persist } from 'zustand/middleware';

export const useHomeStore = create(
  persist(
    (set, get) => ({
      // 계산된 값들
      tdee: null,
      targetCalories: null,
      currentWeight: null,
      goalWeight: null, // 목표 무게

      // 호출 값들
      waterData: null, //{current, goal}
      mealData: null, // {id, breackfast, lunch, dinner, snack}
      originalMealData: null, // 원본 식단 데이터

      // UI 상태
      selectedDate: new Date(),
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
          weight: userData?.weight,
          height: userData?.height,
          gender: userData?.gender,
          age: userData?.age,
          excercise: userData?.goals.targetExercise,
          goalWeight: userData?.goals.targetWeight,
        });

        set({
          tdee: Math.round(tdee),
          targetCalories: Math.round(targetCalories),
          currentWeight: currentWeight,
          goalWeight: goalWeight,
        });
      },

      // 데이터 정제
      setDailyData: (data, userData) => {
        const water = normalizerWater({
          water: data.waterData[0],
          age: userData?.age,
          gender: userData?.gender,
          targetIntake: userData?.targetIntake,
        });
        const meal = normalizerMeal(data.mealData[0]);
        set({ waterData: water, mealData: meal, originalMealData: data.mealData[0]?.meals });
      },

      // 초기화
      resetCalories: () => set({ tdee: null, targetCalories: null }),
    }),
    // 로컬스토리지에 현재 체중 저장
    {
      name: 'current-weight',
      partialize: (state) => state.currentWeight,
    },
  ),
);
