import { create } from 'zustand';
import { normalizeDataRange, dataSummary, getAllMealsSorted, waterDataSummary, getWaterMonthlyAverages } from '@/utils/reportDataParser';

export const useReportStore = create((set, get) => ({
  // UI

  // 식단 데이터
  originalMealData: null,

  nutrients: {},

  mealSortedByCarbs: [],
  mealSortedByFat: [],
  mealSortedByProtein: [],

  // 수분량 데이터
  originalWaterData: null,

  watersData: [],
  calculatedWater: {},
  totalWaters: 0,

  // 식단
  setNutrients: (data, originDate, activePeriod) => {
    const meal = dataSummary(normalizeDataRange(data?.mealData ?? [], originDate, activePeriod));
    set({ nutrients: meal, originalMealData: data?.mealData });
  },

  setSortedByNutrients: (data, originDate, activePeriod, types) => {
    const meal = getAllMealsSorted(
      normalizeDataRange(data?.mealData ?? [], originDate, activePeriod),
      types,
    );

    const typeMapping = {
      carbs: 'Carbs',
      fat: 'Fat',
      protein: 'Protein',
    };

    const mappedType = typeMapping[types];

    set({
      originalMealData: data?.mealData,
      [`mealSortedBy${mappedType}`]: meal,
    });
  },

  // 수분량
  setWatersData: (data, originDate, activePeriod) => {
    const water = normalizeDataRange(data?.waterData ?? [], originDate, activePeriod);
    console.log(water)
    set({ watersData: water, originalMealData: data?.waterData });
  },

  setMonthlyWatersData: (data, originDate, activePeriod) => {
    const normalizedWaters = normalizeDataRange(data?.waterData ?? [], originDate, activePeriod)
    const weeklyAverages = getWaterMonthlyAverages(normalizedWaters, originDate);

    set({ watersData: weeklyAverages, originalMealData: data?.waterData });
  },

  setCalcuatWatersData: (data, originDate, activePeriod) => {
    const water = waterDataSummary(normalizeDataRange(data?.waterData ?? [], originDate, activePeriod), originDate);
    set({ calculatedWater: water, totalWaters:water?.totalWaters, originalMealData: data?.waterData });
  },

  resetWaters: () => set({ watersData: [], calculatedWater: null }),

}));
