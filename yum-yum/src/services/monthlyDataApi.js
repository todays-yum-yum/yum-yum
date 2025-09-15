import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from './../services/firebase';
import { getEndDateOfMonth, parseDateString, getStartDateOfMonth } from '../utils/dateUtils';

export const getMonthlyData = async (userId, startDay, endDay) => {
  try {
    // 컬렉션 참조 생성
    const mealRef = collection(firestore, 'users', userId, 'meal');
    const waterRef = collection(firestore, 'users', userId, 'water');

    const mealQuery = query(
      mealRef,
      where('createdAt', '>=', Timestamp.fromDate(startDay)),
      where('createdAt', '<', Timestamp.fromDate(endDay)),
      orderBy('createdAt'),
    );

    const waterQuery = query(
      waterRef,
      where('createdAt', '>=', Timestamp.fromDate(startDay)),
      where('createdAt', '<', Timestamp.fromDate(endDay)),
      orderBy('createdAt'),
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
