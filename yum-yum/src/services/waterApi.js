import { firestore } from '@/services/firebase';
import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

// 수분 섭취량 기록
export const addWaterIntake = async (userId, date, amount) => {
  try {
    const waterDoc = doc(firestore, 'users', userId, 'water', date);
    const snapShot = await getDoc(waterDoc);

    // 이전 수분 섭취량 총합
    const prevTotal = snapShot.exists() ? snapShot.data().dailyTotal : 0;
    const addedAmount = amount - prevTotal; // 한번 마신양
    const newTotal = prevTotal + addedAmount; // 이전 총합 + 한번 마신양

    if (!snapShot.exists()) {
      await setDoc(waterDoc, {
        date,
        intakes: [{ amount: addedAmount, timestamp: new Date() }],
        dailyTotal: newTotal,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(waterDoc, {
        intakes: arrayUnion({ amount: addedAmount, timestamp: new Date() }),
        dailyTotal: newTotal,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('수분 기록 중 오류 발생:', error);
    throw error;
  }
};

// 수분 섭취량 조회
export const getWaterIntake = async (userId, date) => {
  try {
    const waterDoc = doc(firestore, 'users', userId, 'water', date);
    const snapShot = await getDoc(waterDoc);
    if (snapShot.exists()) {
      return snapShot.data();
    }
  } catch (error) {
    console.error('수분 기록 불러오는 중 오류 발생:', error);
    throw error;
  }
};

// 수분 섭취량 설정 조회
export const getWaterSettings = async (userId) => {
  try {
    const docRef = doc(firestore, 'users', userId);
    const snapShot = await getDoc(docRef);

    if (!snapShot.exists()) return null;

    return {
      oneTimeIntake: snapShot.data().oneTimeIntake,
      targetIntake: snapShot.data().targetIntake,
    };
  } catch (error) {
    console.error('수분 섭취량 설정 불러오는 중 오류 발생:', error);
    throw error;
  }
};

// 수분 섭취량 설정 수정
export const saveWaterSettings = async (userId, oneTimeIntake, targetIntake) => {
  try {
    const docRef = doc(firestore, 'users', userId);

    await updateDoc(docRef, {
      oneTimeIntake: Number(oneTimeIntake),
      targetIntake: Number(targetIntake),
    });
  } catch (error) {
    console.error('수분 섭취량 설정 수정 중 오류 발생:', error);
    throw error;
  }
};
