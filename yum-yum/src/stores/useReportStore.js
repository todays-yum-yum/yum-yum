import { create } from 'zustand';
import {
  normalizeDataRange,
  weightNormalizeDataRange,
  dataSummary,
  getAllMealsSorted,
  waterDataSummary,
  getWaterMonthlyAverages,
} from '@/utils/reportDataParser';
import {
  getPeriodLastData,
  getWeightMonthlyData,
  getWeightWeeklyData,
  getWeightYearlyData,
} from '../utils/reportDataParser';
import { todayDate } from '../utils/dateUtils';

const searchConfig = {
  일간: 'daily',
  주간: 'weekly',
  월간: 'monthly',
};

export const useReportStore = create((set, get) => ({

  // 날짜 관련
  date: todayDate(),

  // UI
  calendarOpen: false,

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

  // 체중 데이터

  originWeightData: null,

  currentWeight: 0,
  weightData: [],

  // ai
  searchType: '',

  nutrientionReport: {},

  // ----

  // 날짜
  setDate: (date) => set({ date }),

  // UI
  setCalendarOpen: (status) => set({ calendarOpen: status }),

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
    set({ watersData: water, originalMealData: data?.waterData });
  },

  setMonthlyWatersData: (data, originDate, activePeriod) => {
    const normalizedWaters = normalizeDataRange(data?.waterData ?? [], originDate, activePeriod);
    const weeklyAverages = getWaterMonthlyAverages(normalizedWaters, originDate);

    set({ watersData: weeklyAverages, originalMealData: data?.waterData });
  },

  setCalcuatWatersData: (data, originDate, activePeriod) => {
    const water = waterDataSummary(
      normalizeDataRange(data?.waterData ?? [], originDate, activePeriod),
      originDate,
    );
    set({
      calculatedWater: water,
      totalWaters: water?.totalWaters,
      originalMealData: data?.waterData,
    });
  },

  resetWaters: () => set({ watersData: [], calculatedWater: null }),

  // 체중
  setCurrentWeight: (data, originDate, activePeriod) => {
    // const weight = normalizeDataRange(data?.weightData ?? [], originDate, activePeriod);
    // const weightData = getPeriodLastData(weight).weight;
    // data는 localstorage에서 가져온 데이터
    set({
      currentWeight: data,
    });
  },

  setDailyWeightData: (data, originDate, activePeriod) => {
    const weight = weightNormalizeDataRange(data?.weightData ?? [], originDate, activePeriod);
    const weightData = getWeightWeeklyData(weight, originDate);
    set({
      weightData: weightData,
    });
  },

  setWeeklyWeightData: (data, originDate, activePeriod) => {
    const weight = weightNormalizeDataRange(data?.weightData ?? [], originDate, activePeriod);
    const weightData = getWeightMonthlyData(weight, originDate);
    // console.log('setWeeklyWeightData weightData: ', weightData);

    set({
      weightData: weightData,
    });
  },

  setMonthlyWeightData: (data, originDate, activePeriod) => {
    const weight = weightNormalizeDataRange(data?.weightData ?? [], originDate, activePeriod);
    const weightData = getWeightYearlyData(weight, originDate);
    set({
      weightData: weightData,
    });
  },

  // ai
  setSearchType: (activePeriod) => {
    set({
      searchType: searchConfig[activePeriod],
    });
  },

  setNutrientionReport: (data) => {
    set({
      nutrientionReport: data,
    });
  },
}));
