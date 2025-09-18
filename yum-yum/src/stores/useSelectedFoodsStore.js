import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSelectedFoodsStore = create(
  persist(
    (set, get) => ({
      selectedFoods: {},

      activeTab: 'frequent',

      setActiveTab: (tab) => set({ activeTab: tab }),

      // 음식 선택 여부
      isFoodSelected: (id) => Boolean(get().selectedFoods[id]),

      // 음식 추가/수정
      addFood: (food) =>
        set((state) => ({
          selectedFoods: { ...state.selectedFoods, [food.id]: food },
        })),

      // 음식 삭제
      deleteFood: (id) =>
        set((state) => {
          const copy = { ...state.selectedFoods };
          delete copy[id];
          return { selectedFoods: copy };
        }),

      // 전체 삭제
      clearFoods: () => set({ selectedFoods: {} }),
    }),
    {
      name: 'selected-foods-storage',
    },
  ),
);
