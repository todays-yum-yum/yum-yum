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

  // mealType별로 그룹화
  meals.forEach((meal) => {
    const type = meal.mealType;

    if (mealTypes[type]) {
      // 칼로리 누적
      mealTypes[type].calories += meal.kcal || 0;

      // 음식 이름 누적 (쉼표로 구분)
      if (meal.foodName) {
        if (mealTypes[type].foods) {
          mealTypes[type].foods += `, ${meal.foodName}`;
        } else {
          mealTypes[type].foods = meal.foodName;
        }
      }
    }
  });

  return mealTypes;
};

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
