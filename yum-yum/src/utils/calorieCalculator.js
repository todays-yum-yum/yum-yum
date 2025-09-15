// 칼로리 목표 계산, 목표 수분 계산

const ACTIVITY = {
  none: 1.2,
  light: 1.375,
  moderate: 1.55,
  intense: 1.725,
};

// BMI(기초 대사율) 계산 (Mifflin-ST Jeor 공식)
function BMICalculate({ weight, height, gender, age }) {
  let BMR = 0;
  if (gender === 'male') {
    // 남성인 경우
    BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    // 여성인 경우
    BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return BMR;
}

// TDEE 계산 = BMR * 활동지수
function TDEECalculate({ weight, height, gender, age, excercise = 'none' }) {
  return BMICalculate({ weight, height, gender, age }) * ACTIVITY[excercise];
}

// 칼로리 목표 계산
export function calorieCalculator({ weight, height, gender, age, excercise = 'none', goalWeight }) {
  // 1. TDEE 계산
  const tdee = TDEECalculate({ weight, height, gender, age, excercise });

  // 2. 체중 차이 계산
  const weightDifference = goalWeight - weight; // 음수면 감량, 양수면 증량

  // 3. 목표 칼로리 계산
  let targetCalories;

  if (Math.abs(weightDifference < 0.5)) {
    // 목표 체중과 현재 체중 차이가 0.5kg 미만이면 유지
    targetCalories = tdee;
  } else if (weightDifference < 0) {
    // 감량 목표
    const weeklyWeightLoss = Math.min(Math.abs(weightDifference), 1); // 최대 주당 1kg
    const dailyCalorieDeficit = (weeklyWeightLoss * 7700) / 7; // 일일 칼로리 적자
    targetCalories = tdee - dailyCalorieDeficit;

    // 안전 범위 체크 (BMR의 120% 또는 최소 칼로리 이하로 내려가지 않도록)
    const minCalories = gender === 'male' ? 1500 : 1200;
    const bmr = calculateBMR({ weight, height, gender, age }); // BMR 함수 필요
    const safeMinimum = Math.max(bmr * 1.2, minCalories);

    targetCalories = Math.max(targetCalories, safeMinimum);
  } else {
    // 증량 목표
    const weeklyWeightGain = Math.min(weightDifference, 0.5); // 최대 주당 0.5kg
    const dailyCalorieSurplus = (weeklyWeightGain * 7700) / 7; // 일일 칼로리 잉여
    targetCalories = tdee + dailyCalorieSurplus;
  }

  return {
    currentWeight: weight, // 현재 무게
    goalWeight, // 목표 무게
    targetCalories: Math.round(targetCalories), // 목표 칼로리
    weightDifference, // 체중 차이
    tdee: Math.round(tdee), // tdee
    plan: weightDifference < -0.5 ? '감량' : weightDifference > 0.5 ? '증량' : '유지', // 목표
  };
}

// 목표 수분량 : 보건복지부 기준 권장량
export function calculateWaterIntake(age, gender) {
  if (age >= 1 && age <= 2) return 1300; // ml
  if (age >= 3 && age <= 5) return 1400;
  if (age >= 6 && age <= 8) return 1700;
  if (age >= 9 && age <= 11) return 2100;
  if (age >= 12 && age <= 14) {
    return gender === 'male' ? 2400 : 2000;
  }
  if (age >= 15 && age <= 18) {
    return gender === 'male' ? 2700 : 2000;
  }
  // 성인 (19세 이상)
  return gender === 'male' ? 2600 : 2100;
}

// 칼로리 대비 각 영양소 비율 계산
export function calculateNutrientRatio(carbs = 0, proteins = 0, fats = 0) {

  const totalCalories = carbs * 4 + proteins * 4 + fats * 9;

  return {
    carbsRatio: Math.round((carbs * 4) / totalCalories) * 100,
    proteinsRatio : Math.round((proteins * 4) / totalCalories) * 100,
    fatsRatio : Math.round((fats * 9) / totalCalories) * 100,
  }
}