// 메인 페이지 - 몸무게 설정 api 서비스
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { firestore } from './firebase'; //firestore 초기화
import { getTodayKey } from '../utils/dateUtils';

// 몸무게 저장
export async function saveWeight({ userId, weight, date }) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error(`userId: ${userId}. 유저아이디는 string 값이어야 합니다.`);
    }
    if (!weight || typeof weight !== 'number') {
      throw new Error(`weight: ${weight}. 몸무게 값은 무조건 숫자값이어야 합니다.`);
    }
    // batch 사용
    const batch = writeBatch(firestore);

    // 선택 날짜
    const inputDate = getTodayKey(new Date(date));
    // 오늘 날짜
    const today = getTodayKey(new Date());
    // users의 현재 체중 업데이트
    if (inputDate == today) {
      const userRef = doc(firestore, 'users', userId);
      batch.update(userRef, { weight: weight, updatedAt: serverTimestamp() });
    }

    // 입력할 데이터
    const newChange = {
      weight: weight,
      timestamp: new Date(),
    };

    // weight 문서 업데이트 혹은 추가
    const weightDocRef = doc(firestore, 'users', userId, 'weight', inputDate);

    // 문서 존재 여부 확인
    const docSnapshot = await getDoc(weightDocRef);

    if (docSnapshot.exists()) {
      // 존재하는경우 업데이트
      batch.update(weightDocRef, { changes: arrayUnion(newChange), updatedAt: serverTimestamp() });
    } else {
      // 존재하지 않는 경우 새로 만듦
      batch.set(weightDocRef, {
        date: inputDate,
        changes: [newChange],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // batch 실행
    await batch.commit();

    return {
      success: true,
      message: '저장 성공',
      data: { weight },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
}
