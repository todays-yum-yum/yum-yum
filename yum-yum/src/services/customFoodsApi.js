import { firestore } from '@/services/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
