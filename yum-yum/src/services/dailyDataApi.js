import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from './firebase';

export async function getDailyData(userId, selectedDate) {
  console.log('dailyDataApi service: ', userId, selectedDate);
  try {
    // 컬렉션 참조 생성
    const waterRef = collection(firestore, 'users', userId, 'water');
    const mealRef = collection(firestore, 'users', userId, 'meal');
    // 쿼리 생성
    const waterQuery = query(waterRef, where('date', '==', selectedDate));
    const mealQuery = query(mealRef, where('date', '==', selectedDate));

    // 호출 Promise all
    const [waterSnap, mealSnap] = await Promise.all([getDocs(waterQuery), getDocs(mealQuery)]);

    //데이터 추출
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
}

/*
    const [waterData, mealData] = await Promise.all([
      db.collection("water").findOne({ userId, date: selectedDate }),
      db.collection("meal").findOne({ userId, date: selectedDate }),
    ]); 

    물을 몇 번 입력을 받을지 최대값 정해두면 좋을 수도!(추후)

    where , in 사용방법 
    Promise.all 사용방법

    // 예제!!
    // water document 경로
    const waterRef = doc(db, "users", userId, "water", selectedDate);
    // meal document 경로
    const mealRef = doc(db, "users", userId, "meal", selectedDate);

    const [waterSnap, mealSnap] = await Promise.all([
      getDoc(waterRef),
      getDoc(mealRef),
    ]);

    진행상황, 회의록 작성

*/
