// 메인 페이지에서 사용되는 데이터 파싱/정제 함수 모음

import { calculateWaterIntake } from './calorieCalculator';

// dailyTotal 계산이 안되어있는 경우 합 구하는 함수
const waterDailySum = (intakes) => {
  if (!intakes) return 0;

  let sum = 0;
  intakes.map((value) => {
    sum += value.amount;
  });
  return sum;
};

// ml -> L 변환 함수
const convertMlToL = (ml) => ml / 1000;

// mealType별 데이터 파싱 함수
const parseMealsByType = (meals) => {
  const mealTypes = {
    breakfast: { calories: 0, foods: null },
    lunch: { calories: 0, foods: null },
    dinner: { calories: 0, foods: null },
    snack: { calories: 0, foods: null },
  };
  if (!meals || meals.length === 0) return mealTypes;
  console.log(meals);
  // mealType별로 그룹화 -> Object.entries()로 키-값 쌍을 배열로 변환
  Object.entries(meals).forEach(([mealType, mealArray]) => {
    if (mealTypes[mealType] && Array.isArray(mealArray)) {
      mealArray.forEach((meal) => {
        console.log(meal);
        // 칼로리 누적
        mealTypes[mealType].calories += meal.nutrient?.kcal || 0;

        // 음식 이름 누적
        if (meal.foodName) {
          if (mealTypes[mealType].foods) {
            mealTypes[mealType].foods += `, ${meal.foodName}`;
          } else {
            mealTypes[mealType].foods = meal.foodName;
          }
        }
      });
    }
  });
  return mealTypes;
};

// mealType별 데이터 파싱 함수(누적 칼로리, 영양소별 누적값)
function parseNutritionByType(groupedMeals) {
  // 1) 결과물 기본 틀
  const mealTypes = {
    breakfast: { calories: 0, nutrients: {} },
    lunch: { calories: 0, nutrients: {} },
    dinner: { calories: 0, nutrients: {} },
    snack: { calories: 0, nutrients: {} },
  };

  // groupedMeals가 없거나 빈 객체면 기본값 리턴
  if (!groupedMeals || Object.keys(groupedMeals).length === 0) {
    return mealTypes;
  }

  // 2) 각 타입별 배열을 순회
  Object.entries(groupedMeals).forEach(([mealType, mealsArr]) => {
    // 혹시 mealType 키가 mealTypes에 없으면 skip
    const bucket = mealTypes[mealType];
    if (!bucket) return;

    // 3) 그 타입의 식단 배열을 다시 순회
    mealsArr.forEach((meal) => {
      // 3-1) 칼로리 누적
      bucket.calories += meal.kcal || 0;

      // 3-2) 그 외 숫자 필드를 nutrients에 누적
      Object.entries(meal).forEach(([key, value]) => {
        // 건너뛸 필드
        if (key === 'mealType' || key === 'kcal' || key === 'foodName') {
          return;
        }
        if (typeof value === 'number' && !isNaN(value)) {
          bucket.nutrients[key] = (bucket.nutrients[key] || 0) + value;
        }
      });
    });
  });

  return mealTypes;
}

// 칼로리,탄,단,지 total 값 파싱
const mealSum = (dailySummary, meals) => {
  if (dailySummary)
    return {
      calories: dailySummary?.totalCalories ?? 0,
      carbs: dailySummary?.totalCarbs ?? 0,
      protein: dailySummary?.totalProtein ?? 0,
      fat: dailySummary?.totalFat ?? 0,
    };

  let totalCalories = 0,
    totalCarbs = 0,
    totalProtein = 0,
    totalFat = 0;
  meals.map((meal) => {
    totalCalories += meal?.calorie ?? 0;
    totalCarbs += meal?.carbs ?? 0;
    totalProtein += meal?.protein ?? 0;
    totalFat += meal?.fat ?? 0;
  });
  return { calories: totalCalories, carbs: totalCarbs, protein: totalProtein, fat: totalFat };
};

// 식단 데이터 파싱 함수
export function normalizerMeal(meal) {
  if (!meal) return null;
  // 칼로리,탄,단,지 통합 구하기
  const { calories, carbs, protein, fat } = mealSum(meal.dailySummary, meal.meals);
  //mealType별 데이터 파싱
  const mealsByType = parseMealsByType(meal.meals);
  console.log(mealsByType);

  // return null;
  return {
    id: meal.dinner,
    currentCalories: calories || 0,
    carbs: carbs || 0,
    protein: protein || 0,
    fat: fat || 0,
    breakfast: mealsByType?.breakfast,
    lunch: mealsByType?.lunch,
    dinner: mealsByType?.dinner,
    snack: mealsByType?.snack,
  };
}

// 수분 데이터 파싱 함수
export function normalizerWater(water, age, gender) {
  if (!water) return null;
  // dailyTotal 계산이 안되어있는 경우?
  const total = water?.dailyTotal || waterDailySum(water.intakes);

  // 목표 수분량 = 보건복지부 기준 권장량
  const goal = calculateWaterIntake(age, gender);
  return {
    id: water.id,
    current: convertMlToL(total),
    goal: convertMlToL(goal),
  };
}

//--------------------------
/**
 * Firebase 에 저장된 로우 데이터를
 * UI/Api 호출에 적합한 형태로 변환
 */
export function parseMeals(rawMeals, selectedDate) {
  const { totalNutrition, mealBreakdown } = multiDataParse(rawMeals.data);
  return {
    date: selectedDate,
    totalNutrition,
    mealBreakdown,
    type: rawMeals.type,
  };
}

// 파싱 할 때 값이 여러개 일 때(type: weekly, monthly)
function multiDataParse(data) {
  const totalNutrition = {};
  const mealBreakdown = [];

  data.forEach((value) => {
    // totalNutrition 값 합
    Object.entries(value.dailySummary).forEach(([key, value]) => {
      // 숫자 타입만 누적
      if (typeof value === 'number' && !isNaN(value)) {
        totalNutrition[key] = (totalNutrition[key] || 0) + value;
      }
    });
    // mealBreakdown 값 합 data.meals
    mealBreakdown.push({ date: value.date, nutrients: parseNutritionByType(value.meals) });
  });

  return { totalNutrition, mealBreakdown };
}
