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
} from '@/utils/reportDataParser';
import { todayDate, getEndDateOfWeek, getStartDateOfWeek, parseDateString  } from '@/utils/dateUtils';
import { canMoveDate, getLastMonth, getLastWeek, getNextMonth, getNextWeek, getTomorrow, getYesterday } from '../utils/dateUtils';

const searchConfig = {
  일간: 'daily',
  주간: 'weekly',
  월간: 'monthly',
};

export const useReportStore = create((set, get) => ({

  // 날짜 관련
  date: todayDate(),

  // UI
  activePeriod: '일간',
  calendarOpen: false,
  reportTypes: [{ name: '식단' }, { name: '수분' }, { name: '체중' }, { name: 'AI 리포트' }],

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
  setActivePeriod: (period) => set({ activePeriod: period }),

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


  // 계산

  // 표기 날짜 : 일간/주간/월간에 따라 다름
  getDisplayDate: (period, date, day) => {
    // 오늘 날짜, 년, 월, 일 분리
    const parsedDate = parseDateString(date);
    const today = parseDateString(todayDate());

    switch (period) {
      case '일간':
        return `${parsedDate.month}월 ${parsedDate.date}일 (${day})`;
      case '주간': {
        // 월, 일만 추출
        const startDate = parseDateString(getStartDateOfWeek(date));
        const weekEndDate = parseDateString(getEndDateOfWeek(date));

        const endDate = weekEndDate.originDate < today.originDate ? weekEndDate : today;

        return `${startDate.month}월 ${startDate.date}일 ~ ${endDate.month}월 ${endDate.date}일`;
      }
      case '월간':
        return `${parsedDate.year}년 ${parsedDate.month}월`;
      default:
        return date;
    }
  },

  // 다음 단위 기간으로 갈 수 있는지(오늘보다 미래로 가는 것을 막기)
  getCanMove: () => {
    const { date, activePeriod } = get();
    const days = activePeriod === '일간' ? 1 : activePeriod === '주간' ? 7 : 30;

    return canMoveDate(date, days);
  },

  // 이동

  // 이전 단위 기간으로
  handlePrevDate: (activePeriod) => {
    set((state) => {
      let newDate;
      switch (activePeriod) {
        case '일간':
          newDate = getYesterday(state.date);
          break;
        case '주간':
          newDate = getLastWeek(state.date);
          break;
        case '월간':
          newDate = getLastMonth(state.date);
          break;
        default:
          newDate = state.date;
      }
      return { date: newDate };
    });
  },

    // 이후 단위 기간으로
  handleNextDate: (activePeriod) => {
    set((state) => {
      let newDate;

      switch (activePeriod) {
        case '일간':
          newDate = getTomorrow(state.date);
          break;
        case '주간':
          newDate = getNextWeek(state.date);
          break;
        case '월간':
          newDate = getNextMonth(state.date);
          break;
        default:
          newDate = state.date;
      }
      return { date: newDate };
    });
  },

}));
