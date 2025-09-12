import { create } from 'zustand';
import { toNum } from '@/utils/NutrientNumber';

const DEFAULTS = {
  foodName: '',
  foodSize: '',
  foodUnit: 'g',
  nutrient: {
    kcal: null, // 칼로리
    carbs: null, // 탄수화물
    sugar: null, // 당
    sweetener: null, // 대체감미료
    fiber: null, // 식이섬유
    protein: null, // 단백질
    fat: null, // 지방
    satFat: null, // 포화지방
    transFat: null, // 트랜스지방
    unsatFat: null, // 불포화지방
    cholesterol: null, // 콜레스테롤
    sodium: null, // 나트륨
    potassium: null, // 칼륨
    caffeine: null, // 카페인
  },
};

export const useCustomFoodStore = create((set, get) => ({
  ...DEFAULTS,

  setField: (key, v) => set({ [key]: v }),
  setNutrient: (key, v) => set((state) => ({ nutrient: { ...state.nutrient, [key]: v } })),

  reset: () =>
    set({
      ...DEFAULTS,
      nutrient: { ...DEFAULTS.nutrient },
    }),

  validate: () => {
    const { foodName, foodSize, nutrient } = get();
    if (!foodName.trim()) return { ok: false }; // 음식명
    if (!Number(foodSize)) return { ok: false }; // 내용량
    if (!Number(nutrient.kcal)) return { ok: false }; // 칼로리
    return { ok: true };
  },

  createCustomFood: (userId) => {
    const { foodName, foodSize, foodUnit, nutrient } = get();
    return {
      userId,
      foodName: foodName.trim(),
      servingSize: Number(foodSize),
      servingUnit: foodUnit,
      nutrient: {
        kcal: Number(nutrient.kcal), // 칼로리
        carbs: toNum(nutrient.carbs), // 탄수화물
        sugar: toNum(nutrient.sugar), // 당
        sweetener: toNum(nutrient.sweetener), // 대체감미료
        fiber: toNum(nutrient.fiber), // 식이섬유
        protein: toNum(nutrient.protein), // 단백질
        fat: toNum(nutrient.fat), // 지방
        satFat: toNum(nutrient.satFat), // 포화지방
        transFat: toNum(nutrient.transFat), // 트렌스지방
        unsatFat: toNum(nutrient.unsatFat), // 불포화지방
        cholesterol: toNum(nutrient.cholesterol), // 콜레스테롤
        sodium: toNum(nutrient.sodium), // 나트륨
        potassium: toNum(nutrient.potassium), // 칼륨
        caffeine: toNum(nutrient.caffeine), // 카페인
      },
      createdAt: new Date(),
    };
  },
}));
