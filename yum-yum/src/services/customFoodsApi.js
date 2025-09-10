import { firestore } from '@/services/firebase';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  orderBy,
  query,
  getDocs,
} from 'firebase/firestore';

// 직접 입력 음식 등록
export const addCustomFood = async (userId, newFoodData) => {
  try {
    const customFoodsCol = collection(firestore, 'users', userId, 'customFoods');
    const newFoodDoc = doc(customFoodsCol);

    // 파이어스토어에 쓰기
    await setDoc(newFoodDoc, {
      ...newFoodData,
      id: newFoodDoc.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return newFoodDoc.id;
  } catch (error) {
    console.error('직접 등록 중 오류 발생:', error);
    throw error;
  }
};

// 집접 입력 음식 조회
export const customFoodsList = async () => {
  try {
    // const customFoodsCol = collection(firestore, 'users', userId, 'customFoods');
    const customFoodsCol = collection(firestore, 'users', 'test-user', 'customFoods');
    const q = query(customFoodsCol, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const groups = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        foodName: data.foodName,
        makerName: data.makerName ?? '',
        foodSize: data.servingSize,
        foodUnit: data.servingUnit,
        kcal: data.nutrient.kcal,

        nutrient: {
          kcal: data?.nutrient?.kcal ?? undefined,
          carbs: data?.nutrient?.carbs ?? null,
          sugar: data?.nutrient?.sugar ?? null,
          sweetener: data?.nutrient?.sweetener ?? null,
          fiber: data?.nutrient?.fiber ?? null,
          protein: data?.nutrient?.protein ?? null,
          fat: data?.nutrient?.fat ?? null,
          satFat: data?.nutrient?.satFat ?? null,
          transFat: data?.nutrient?.transFat ?? null,
          unsatFat: data?.nutrient?.unsatFat ?? null,
          cholesterol: data?.nutrient?.cholesterol ?? null,
          sodium: data?.nutrient?.sodium ?? null,
          potassium: data?.nutrient?.potassium ?? null,
          caffeine: data?.nutrient?.caffeine,
        },
      };
    });

    return groups;
  } catch (error) {
    console.error('불러오기 중 오류 발생:', error);
    throw error;
  }
};
