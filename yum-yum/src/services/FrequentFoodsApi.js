import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import { toNum } from '@/utils/NutrientNumber';

// 자주 먹은 음식 조회
export const getFrequentFoods = async () => {
  try {
    // const mealCol = collection(firestore, 'users', useId, 'meal');
    const mealCol = collection(firestore, 'users', 'test-user', 'meal');
    const snapshot = await getDocs(mealCol);

    const foodCount = {};

    // meal
    snapshot.forEach((doc) => {
      const data = doc.data();

      // meals 객체
      Object.values(data.meals).forEach((mealArray) => {
        // 아침/점심/저녁/기타의 각 배열
        mealArray.forEach((f) => {
          if (!f.foodName) return;

          // 없으면 객체 전체 저장, count+1
          if (!foodCount[f.id]) {
            foodCount[f.id] = {
              id: f.id,
              foodName: f.foodName ?? '',
              makerName: f.makerName ?? '',
              foodSize: f.foodSize ?? 0,
              foodUnit: f.foodUnit ?? 'g',

              nutrient: {
                kcal: f.nutrient?.kcal,
                carbs: toNum(f.nutrient?.carbs),
                protein: toNum(f.nutrient?.protein),
                fat: toNum(f.nutrient?.fat),
                sugar: toNum(f.nutrient?.sugar),
                sweetener: toNum(f.nutrient?.sweetener),
                fiber: toNum(f.nutrient?.fiber),
                satFat: toNum(f.nutrient?.satFat),
                transFat: toNum(f.nutrient?.transFat),
                unsatFat: toNum(f.nutrient?.unsatFat),
                cholesterol: toNum(f.nutrient?.cholesterol),
                sodium: toNum(f.nutrient?.sodium),
                potassium: toNum(f.nutrient?.potassium),
                caffeine: toNum(f.nutrient?.caffeine),
              },
              count: 0,
            };
          }
          // 있으면 count+1
          foodCount[f.id].count += 1;
        });
      });
    });

    const sortedFoods = Object.values(foodCount).sort((a, b) => b.count - a.count); // 내림차순 정렬

    return sortedFoods;
  } catch (error) {
    console.error('불러오기 중 오류 발생:', error);
    throw error;
  }
};
