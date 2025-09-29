import { collection, query, where, orderBy, getDocs, Timestamp, limit } from 'firebase/firestore';
import { firestore } from './../services/firebase';
import { getStartDateAndEndDate } from '../utils/dateUtils';

export const getMonthlyData = async (userId, startDay, endDay) => {
  const startOfDay = startDay;
  const endOfDay = endDay;
  /* 체중 부분만 시작일, 마지막일자 범위 수정 */
  const { start, end } = getStartDateAndEndDate(new Date(startOfDay), 'year');

  try {
    // 컬렉션 참조 생성
    const mealRef = collection(firestore, 'users', userId, 'meal');
    const waterRef = collection(firestore, 'users', userId, 'water');
    const weightRef = collection(firestore, 'users', userId, 'weight');

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

    const weightQuery = query(
      weightRef,
      where('date', '>=', start),
      where('date', '<', end),
      orderBy('date'),
      // limit(1),
    );

    const [waterSnap, mealSnap, weightSnap] = await Promise.all([
      getDocs(waterQuery),
      getDocs(mealQuery),
      getDocs(weightQuery),
    ]);

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

    // console.log('월간 데이터 :', startDay, endDay, weightData);

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
};
