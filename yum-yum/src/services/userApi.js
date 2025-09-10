// services/userApi.js
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { mockUser } from '@/data/mockUser';

// 사용자 데이터 가져오기
export async function getUserData(userId) {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));

    if (userDoc.exists()) {
      return {
        success: true,
        data: userDoc.data(),
      };
    } else {
      // Firestore에 데이터가 없는 경우 mock데이터 사용(개발때만 사용)
      return {
        success: true,
        data: mockUser,
      };
    }
  } catch (error) {}
}
