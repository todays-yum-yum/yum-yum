import { create } from 'zustand';

export const useSearchFoodStore = create((set, get) => ({
  searchFoodResults: [], // 검색 결과

  // 음식 검색 결과 입력
  setSearchFoodResults: (food) =>
    set(() => ({
      searchFoodResults: food,
    })),
}));
