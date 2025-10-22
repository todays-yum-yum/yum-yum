import { firestore } from '@/services/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toNum } from '@/utils/nutrientNumber';

export const totalDailySummary = (allFoods) => {
  return {
    totalCalories: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.kcal), 0), // 칼로리
    totalCarbs: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.carbs), 0), // 탄수화물
    totalProtein: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.protein), 0), // 단백질
    totalFat: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.fat), 0), // 지방
    totalSugar: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.sugar), 0), // 당류
    totalSweetener: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.sweetener), 0), // 대체 감미료
    totalFiber: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.fiber), 0), // 식이섬유
    totalSaturatedFat: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.satFat), 0), // 포화지방
    totalTransFat: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.transFat), 0), // 트랜스지방
    totalUnsaturatedFat: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.unsatFat), 0), // 불포화지방
    totalCholesterol: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.cholesterol), 0), // 콜레스테롤
    totalSodium: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.sodium), 0), // 나트륨
    totalPotassium: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.potassium), 0), // 칼륨
    totalCaffeine: allFoods.reduce((sum, f) => sum + toNum(f.nutrient?.caffeine), 0), // 카페인
  };
};

export const saveMeal = async (userId, date, mealType, newMeals) => {
  try {
    const mealDoc = doc(firestore, 'users', userId, 'meal', date);

    // 기존 식단 불러오기
    const snapShot = await getDoc(mealDoc);
    const existingData = snapShot.exists() ? snapShot.data() : {};

    // 기존 식단 + 새 식단
    const updatedMeals = {
      ...(existingData.meals || {}),
      [mealType]: newMeals,
    };

    // 하루 단위 계산
    const allFoods = Object.values(updatedMeals).flat(); // 배열을 하나로
    const dailySummary = totalDailySummary(allFoods);

    await setDoc(
      mealDoc,
      {
        date,
        meals: updatedMeals,
        dailySummary,
        createdAt: existingData.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }, // 기존 값이 있으면 업데이트
    );

    return true;
  } catch (error) {
    console.error('식단 등록 중 오류 발생:', error);
    throw error;
  }
};
