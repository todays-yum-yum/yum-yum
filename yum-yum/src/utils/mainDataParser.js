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

// 식단 데이터 파싱 함수
export function normalizerMeal(meal) {
  if (!meal) return null;
  // 식단 데이터 추가 시 수정해야함
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
