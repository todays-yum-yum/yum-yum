// services/userApi.js
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';

// 사용자 데이터 가져오기(전체 데이터)
export async function getUserData(userId) {
  console.log('호출 시작');
  try {
    const docRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('getUserData services: ', docSnap);
      console.log('getUserData services: ', docSnap.data());
      return {
        success: true,
        data: docSnap.data(),
      };
    } else {
      throw new Error({ message: '데이터가 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// 사용자 데이터 가져오기(무게만 가져옴)
export async function getUserWeightData(userId) {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));

    if (userDoc.exists()) {
      return {
        success: true,
        data: userDoc.data(),
      };
    }
    return {
      success: false,
      error: '사용자 정보를 찾을 수 없습니다.',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
}
