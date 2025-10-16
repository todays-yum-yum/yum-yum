// utils/normalizeData.ts
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import {
  dateFormatting,
  getDayOfWeek,
  getEndDateOfMonth,
  getEndDateOfWeek,
  getStartDateAndEndDate,
  getStartDateOfMonth,
  getStartDateOfWeek,
  getTodayKey,
  parseDateString,
  parseKeyDateString,
  todayDate,
} from './dateUtils';
import { toNum } from './nutrientNumber';
import { ko } from 'date-fns/locale';

export function normalizeDataRange(rawData, selectedDate, period) {
  let startDay;
  let endDay;

  if (period === '일간') {
    startDay = parseDateString(selectedDate);
    endDay = parseDateString(selectedDate);
  } else if (period === '주간') {
    startDay = parseDateString(getStartDateOfWeek(selectedDate));
    const weekEndDay = parseDateString(getEndDateOfWeek(selectedDate));
    const today = parseDateString(todayDate());

    endDay = weekEndDay.originDate < today.originDate ? weekEndDay : today;

    console.log(todayDate());
  } else if (period === '월간') {
    startDay = parseDateString(getStartDateOfMonth(selectedDate));
    endDay = parseDateString(getEndDateOfMonth(selectedDate));
  }

  const start = new Date(startDay.year, startDay.month - 1, startDay.date);
  const end = new Date(endDay.year, endDay.month - 1, endDay.date);

  // 기준의 모든 날짜만큼 생성
  const allDays = eachDayOfInterval({ start, end });

  // rawData를 Map으로 변환해서 빠른 조회 가능
  const dataMap = new Map(rawData.map((d) => [d.date, d]));

  // console.log("normalize : ", start, end, rawData, dataMap);

  // 모든 날짜를 돌면서 없는 날은 0으로 채움
  return allDays.map((day) => {
    const key = format(day, 'yyyy-MM-dd');
    const value = dataMap.get(key);
    return {
      date: key,
      value: value ? structuredClone(value) : 0,
    };
  });
}

/**
 * 체중 데이터는 normalizeDataRange를 분리시킬 필요가 있음
 * @param {{date: string, value: any}[]} rawData
 * @param {string|Date} selectedDate  // '2025-09-15' or Date 객체
 * @param {'일간'|'주간'|'월간'} period
 * @returns {{date: string, value: any}[]}
 */
export function weightNormalizeDataRange(rawData, selectedDate, period) {
  const periodMap = { 주간: 'month', 일간: 'week', 월간: 'year' };

  // 1) selectedDate → Date 객체
  const parseDate = parseDateString(selectedDate);
  const baseDate = new Date(parseDate.year, parseDate.month - 1, parseDate.date);

  const { start, end } = getStartDateAndEndDate(baseDate, periodMap[period]);
  // 기준의 모든 날짜만큼 생성
  const allDays = eachDayOfInterval({ start, end });

  const dataMap = new Map(rawData.map((d) => [d.date, d]));

  // 2) rawData 전처리: dateObj 추가
  const records = allDays.map((day) => {
    const key = format(day, 'yyyy-MM-dd');
    const value = dataMap.get(key);
    return {
      date: key,
      value: value ? structuredClone(value) : 0,
    };
  });

  // console.log(records)
  return records;
}

// 특정 기간의 값을 가공
export const dataSummary = (allFoods) => {
  // 유효한 값이 있는 경우의 날짜를 체크
  const length = allFoods.reduce((result, food) => {
    const value = food.value;

    if (typeof value === 'object' && value !== null) {
      result++;
    }
    return result;
  }, 0);

  // console.log('allFoods', allFoods);

  return {
    totalCalories:
      length > 0
        ? allFoods.reduce((sum, f) => sum + toNum(f.value?.dailySummary?.totalCalories), 0) / length
        : 0, // 칼로리
    totalCarbs: allFoods.reduce((sum, f) => sum + toNum(f.value?.dailySummary?.totalCarbs), 0), // 탄수화물
    totalProtein: allFoods.reduce((sum, f) => sum + toNum(f.value?.dailySummary?.totalProtein), 0), // 단백질
    totalFat: allFoods.reduce((sum, f) => sum + toNum(f.value?.dailySummary?.totalFat), 0), // 지방
    totalSugar: allFoods.reduce((sum, f) => sum + toNum(f.value?.dailySummary?.totalSugar), 0), // 당류
    totalSweetener: allFoods.reduce(
      (sum, f) => sum + toNum(f.value?.dailySummary?.totalSweetener),
      0,
    ), // 대체 감미료
    totalFiber: allFoods.reduce((sum, f) => sum + toNum(f.value?.dailySummary?.totalFiber), 0), // 식이섬유
    totalSaturatedFat: allFoods.reduce(
      (sum, f) => sum + toNum(f.value?.dailySummary?.totalSaturatedFat),
      0,
    ), // 포화지방
    totalTransFat: allFoods.reduce(
      (sum, f) => sum + toNum(f.value?.dailySummary?.totalTransFat),
      0,
    ), // 트랜스지방
    totalUnsaturatedFat: allFoods.reduce(
      (sum, f) => sum + toNum(f.value?.dailySummary?.totalUnsaturatedFat),
      0,
    ), // 불포화지방
    totalCholesterol: allFoods.reduce(
      (sum, f) => sum + toNum(f.value?.dailySummary?.totalCholesterol),
      0,
    ), // 콜레스테롤
    totalSodium: allFoods.reduce((sum, f) => sum + toNum(f.value?.dailySummary?.totalSodium), 0), // 나트륨
    totalPotassium: allFoods.reduce(
      (sum, f) => sum + toNum(f.value?.dailySummary?.totalPotassium),
      0,
    ), // 칼륨
    totalCaffeine: allFoods.reduce(
      (sum, f) => sum + toNum(f.value?.dailySummary?.totalCaffeine),
      0,
    ), // 카페인
  };
};

// 식단 데이터 압축 -> 동일한 데이터 합치고 횟수 세기
export const getAllMealsSorted = (data, nutrientKey = 'kcal') => {
  // console.log('여기 : ', data);

  return data && data.length > 0
    ? data
        .reduce((allMeals, dayData) => {
          // meal 데이터 합침
          if (dayData.value !== 0) {
            const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

            const mealsData = mealTypes.flatMap((mealType) =>
              (dayData.value.meals[mealType] || []).map((meal) => ({
                ...meal,
              })),
            );

            return [...allMeals, ...mealsData];
          }

          return allMeals;
        }, [])
        .reduce((grouped, meal) => {
          // 중복 제거 및 횟수 세기
          const existingMeal = grouped.find((item) => item.foodName === meal.foodName);

          if (existingMeal) {
            existingMeal.count += 1;
            if (existingMeal.nutrient && meal.nutrient) {
              Object.keys(meal.nutrient).forEach((key) => {
                existingMeal.nutrient[key] =
                  toNum(existingMeal.nutrient[key]) + toNum(meal.nutrient[key]);
              });
            }
          } else {
            grouped.push({
              ...meal,
              count: 1, // 횟수 초기값
            });
          }

          return grouped;
        }, [])
        .sort((a, b) => toNum(b.nutrient?.[nutrientKey]) - toNum(a.nutrient?.[nutrientKey]))
    : // nutrientKey 기준으로 내림차순 정렬
      [];
};

// ----

const calculateWeeklyAverage = (weekData) => {
  const validData = weekData.filter(
    (data) =>
      data.value !== 0 && data.value?.dailyTotal !== undefined && data.value?.dailyTotal !== null,
  );

  if (validData.length === 0) {
    return {
      avgDailyTotal: 0,
      validDaysCount: 0,
    };
  }

  const totalSum = validData.reduce((sum, data) => sum + data.value.dailyTotal, 0);

  return {
    avgDailyTotal: totalSum / validData.length,
    validDaysCount: validData.length,
  };
};

export const getWaterMonthlyAverages = (monthlyData, selectedDate) => {
  const { year, month, date } = parseDateString(selectedDate);

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 월간 주차들 가져오기 (일요일 시작)
  const allWeeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 0 }, // 0 = 일요일
  );

  // 미래의 주는 제외
  const weeks = allWeeks.filter((weekStart) => weekStart <= today);

  return weeks.map((weekStart) => {
    let weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

    // 해당 주의 데이터 필터링
    const weekData = monthlyData.filter((data) => {
      const dataDate = new Date(data.date);
      return dataDate >= weekStart && dataDate <= weekEnd;
    });

    return {
      week: format(weekStart, 'yyyy-MM-dd'),
      weekRange: `${format(weekStart, 'M월 d일')} ~ ${format(weekEnd, 'M월 d일')}`,
      value: calculateWeeklyAverage(weekData),
      dataCount: weekData.length,
    };
  });
};

// ----

export const getPeriodLastData = (datas) => {
  // console.log('getPeriodLastData', datas);
  const validData = datas.filter((data) => data.value !== 0);

  if (validData.length === 0) {
    return {
      weight: 0,
      timestamp: 0,
    };
  }
  const dataLength = validData.length;
  const lastData = validData[dataLength - 1];

  const changesLength = lastData?.value?.changes.length;
  const lastDataWeight = lastData?.value?.changes[changesLength - 1];

  return lastDataWeight;
};

export const getWeightWeeklyData = (weeklyData, selectedDate) => {
  const { year, month, date } = parseDateString(selectedDate);
  const currentDate = new Date(year, month - 1, date);
  const today = new Date();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  const endDate = weekEnd < new Date() ? weekEnd : today;

  const WeekDays = eachDayOfInterval({ start: weekStart, end: endDate });

  return WeekDays.map((day) => {
    const dayString = format(day, 'yyyy-MM-dd');
    const dayData = weeklyData.find((item) => item.date === dayString);
    let lastChange = null;
    // if (dayData?.value?.changes && Array.isArray(dayData.value.changes)) {
    //   lastChange = dayData.value.changes[dayData.value.changes.length - 1];
    // }
    if (dayData?.value?.lastchanges) {
      lastChange = dayData.value.lastchanges;
    }

    return {
      date: dayString,
      dayOfWeek: format(new Date(day), 'EEE', { locale: ko }),
      weight: lastChange?.weight ?? 0,
      timestamp: lastChange?.timestamp || null,
    };
  });
};

export const getWeightMonthlyData = (weightData, selectedDate) => {
  const { year, month } = parseDateString(selectedDate);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const today = new Date();

  const allWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 0 });

    // 미래의 주는 제외
  const weeks = allWeeks.filter((weekStart) => weekStart <= today);

  return weeks.map((weekStart, index) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

    const weekWeightData = weightData.filter((item) => {
      const itemDate = new Date(item.date);

      if (item.value === 0) return false;

      return itemDate >= weekStart && itemDate <= weekEnd && item.value !== 0;
    });

    // const lastData = weekWeightData[weekWeightData.length - 1]?.value?.changes;
    // const lastWeight =
    //   weekWeightData[weekWeightData.length - 1]?.value?.changes[lastData.length - 1].weight;
    const weightmap = weekWeightData[weekWeightData.length - 1];
    const lastWeight = weightmap?.value?.lastchanges?.weight;
    // console.log('getWeightMonthlyData: ', lastWeight);

    return {
      week: index + 1,
      weekRange: `${format(weekStart, 'M월 d일')} ~ ${format(weekEnd, 'M월 d일')}`,
      weight: lastWeight || 0,
      measurementDays: weekWeightData.length,
    };
  });
};

export const getWeightYearlyData = (weightData, selectedDate) => {
  const { year } = parseDateString(selectedDate);
  const today = new Date();
  const currentMonth = today.getMonth();

  return Array.from({ length: currentMonth + 1 }, (_, monthIndex) => {
    const monthStart = new Date(year, monthIndex, 1);
    const monthStartStr = getTodayKey(monthStart);
    const monthEnd = new Date(year, monthIndex + 1, 0);
    const monthEndStr = getTodayKey(monthEnd);
    // 해당 월의 체중 데이터들
    // 0가 아닌 데이터만 필터링
    const monthWeightData = weightData
      .filter((item) => {
        return (
          item.date >= monthStartStr &&
          item.date <= monthEndStr &&
          item.value !== 0 &&
          typeof item.value === 'object'
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // 날짜 순으로 정렬

    const lastEntry = monthWeightData[monthWeightData.length - 1];
    const lastWeight = lastEntry ? lastEntry.value.lastchanges?.weight : 0;

    return {
      month: monthIndex + 1,
      monthName: format(monthStart, 'MMM', { locale: ko }),
      weight: lastWeight || 0,
      measurementDays: monthWeightData.length,
    };
  });
  // .filter(month => month.measurementDays > 0);
};

// ----

export const convertMlToL = (ml) => ml / 1000;

export const waterDataSummary = (allWaters) => {
  // 유효한 값이 있는 경우의 날짜를 체크
  const length = allWaters.reduce((result, water) => {
    const value = water.value;

    if (typeof value === 'object' && value !== null) {
      result++;
    }

    return result;
  }, 0);

  // console.log('allWaters', allWaters);

  return {
    totalWaters:
      length > 0
        ? convertMlToL(
            allWaters.reduce((sum, w) => sum + (toNum(w?.value?.dailyTotal ?? 0) || 0), 0) / length,
          )
        : 0,
  };
};

export function formatTime(time, period) {
  if (!time) return '';

  if (period === '일간') {
    const date = new Date(time * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  } else if (period === '주간') {
    const { year, month, date } = parseKeyDateString(time);
    const day = getDayOfWeek(dateFormatting(new Date(year, month - 1, date)));

    return `${month}월 ${date}일 (${day})`;
  }

  return '';
}
