import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from './../services/firebase';

export const getMonthlyData = async (userId, startDay, endDay) => {
  const startOfDay = startDay;
  const endOfDay = endDay;

  // console.log("여기", startOfDay)

  try {
    // 컬렉션 참조 생성
    const mealRef = collection(firestore, 'users', userId, 'meal');
    const waterRef = collection(firestore, 'users', userId, 'water');

    const mealQuery = query(
      mealRef,
      where('date', '>=', startOfDay),
      where('date', '<', endOfDay),
      orderBy('date'),
    );

    const waterQuery = query(
      waterRef,
      where('date', '>=', startOfDay),
      where('date', '<', endOfDay),
      orderBy('date'),
    );
    const [waterSnap, mealSnap] = await Promise.all([getDocs(waterQuery), getDocs(mealQuery)]);

    const waterData = waterSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const mealData = mealSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log(startOfDay, endOfDay, mealQuery);

    return {
      success: true,
      data: {
        waterData: waterData,
        mealData: mealData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
};
