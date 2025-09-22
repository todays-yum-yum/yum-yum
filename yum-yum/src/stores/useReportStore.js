import { create } from 'zustand';
import { normalizeDataRange, dataSummary } from '@/utils/reportDataParser';

export const useReportStore = create((set, get) => ({

  nutrients: {},

  originalMealData: null,

  mealSortedByCarbs: null,
  mealSortedByFat: null,
  mealSortedByProtein: null,
  
  dailymealData: null,

  setNutrients: (data, originDate, activePeriod) => {
    const meal = dataSummary(normalizeDataRange(
      data?.mealData ?? [], originDate, activePeriod
    ));
    set({ nutrients: meal, originalMealData: data.mealData });
  },

  
}));
