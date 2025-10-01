import { strToNum, roundTo1 } from '@/utils/nutrientNumber';

export function calcNutrient(baseNutrient, baseSize, quantity, unit) {
  // 현재 내용량 / 기준 내용량
  const ratio =
    unit === '인분'
      ? Number(quantity) // 인분일 때는 배수
      : baseSize > 0
        ? Number(quantity) / baseSize // g, ml일 때는 비율
        : 0;

  const scale = (v) => (v == null ? null : roundTo1(strToNum(v) * strToNum(ratio)));

  return {
    kcal:
      baseNutrient.kcal == null ? null : Math.round(strToNum(baseNutrient.kcal) * strToNum(ratio)),
    carbs: scale(baseNutrient.carbs),
    sugar: scale(baseNutrient.sugar),
    sweetener: scale(baseNutrient.sweetener),
    fiber: scale(baseNutrient.fiber),
    protein: scale(baseNutrient.protein),
    fat: scale(baseNutrient.fat),
    satFat: scale(baseNutrient.satFat),
    transFat: scale(baseNutrient.transFat),
    unsatFat: scale(baseNutrient.unsatFat),
    cholesterol: scale(baseNutrient.cholesterol),
    sodium: scale(baseNutrient.sodium),
    potassium: scale(baseNutrient.potassium),
    caffeine: scale(baseNutrient.caffeine),
  };
}
