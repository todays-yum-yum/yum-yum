import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firestore } from './firebase';
import { toNum } from '@/utils/NutrientNumber';
import { format, subDays } from 'date-fns';
import { callUserUid } from '@/utils/localStorage';
const userId = callUserUid(); // 로그인한 유저 uid 가져오기

// 최근 3일 먹은 음식 조회
export const getRecentFoods = async () => {
  try {
    const today = new Date(); // 오늘 날짜
    const fiveDaysAgo = subDays(today, 5); // 5일전
    const startDate = format(fiveDaysAgo, 'yyyy-MM-dd');

    // const mealCol = collection(firestore, 'users', useId, 'meal');
    const mealCol = collection(firestore, 'users', userId, 'meal');

    const q = query(mealCol, where('date', '>=', startDate), orderBy('date', 'desc'));

    const snapshot = await getDocs(q);

    const foods = [];

    // meal
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.meals) return;

      const docDate = data.date;

      // meals 객체
      Object.values(data.meals).forEach((mealArray) => {
        // 아침/점심/저녁/기타의 각 배열
        mealArray.forEach((f) => {
          if (!f.foodName) return;

          foods.push({
            id: f.id,
            foodName: f.foodName ?? '',
            makerName: f.makerName ?? '',
            foodSize: f.foodSize ?? 0,
            foodUnit: f.foodUnit ?? 'g',
            date: docDate,
            createdAt: f.createdAt ?? data.createdAt,
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
          });
        });
      });
    });

    // createdAt 순으로 정렬
    foods.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.createdAt.seconds - a.createdAt.seconds;
    });

    // 중복 제거 후 최신것만 남김
    const recentFoods = [];
    const seen = new Set();
    for (const food of foods) {
      if (!seen.has(food.id)) {
        seen.add(food.id);
        recentFoods.push(food);
      }
    }

    return recentFoods;
  } catch (error) {
    console.error('불러오기 중 오류 발생:', error);
    throw error;
  }
};
