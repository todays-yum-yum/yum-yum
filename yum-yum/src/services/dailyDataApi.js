import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { firestore } from './firebase';

export async function getDailyData(userId, selectedDate) {
  const date = new Date(selectedDate).toISOString().split('T')[0];
  
  try {
    // 컬렉션 참조 생성
    const waterRef = collection(firestore, 'users', userId, 'water');
    const mealRef = collection(firestore, 'users', userId, 'meal');
    const weightRef = collection(firestore, 'users', userId, 'weight');
    // 쿼리 생성
    const waterQuery = query(waterRef, where('date', '==', date));
    const mealQuery = query(mealRef, where('date', '==', date));
    const weightQuery = query(weightRef, where('date', '==', date));

    // 호출 Promise all
    const [waterSnap, mealSnap, weightSnap] = await Promise.all([getDocs(waterQuery), getDocs(mealQuery), getDocs(weightQuery)]);

    //데이터 추출
    const waterData = waterSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const mealData = mealSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const weightData = weightSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      data: {
        waterData: waterData,
        mealData: mealData,
        weightData: weightData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
}