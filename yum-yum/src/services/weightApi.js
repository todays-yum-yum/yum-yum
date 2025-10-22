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
    // YYYY-MM
    const monthly = inputDate.substring(0, 7); // yyyy-mm
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
    const weightDocRef = doc(firestore, 'users', userId, 'weight', monthly);

    // 문서 존재 여부 확인
    const docSnapshot = await getDoc(weightDocRef);

    if (docSnapshot.exists()) {
      // 존재하는경우, date가 최신날짜가 아닌경우에만 업데이트
      const oldDate = docSnapshot.data().date; // ex. "2025-09-24"
      // oldDate ≥ inputDate 이면 이미 최신 데이터가 있으므로 업데이트 스킵
      if (oldDate <= inputDate) {
        // inputDate가 더 최신일 때만 lastchanges 업데이트
        batch.update(weightDocRef, {
          date: inputDate,
          lastchanges: {
            weight,
            timestamp: new Date(),
          },
          updatedAt: serverTimestamp(),
        });
      } else {
        console.log('더 최신 데이터가 이미 있어서 월간 문서 업데이트를 스킵합니다.');
      }
    } else {
      // 존재하지 않는 경우 새로 만듦
      batch.set(weightDocRef, {
        date: inputDate,
        lastchanges: newChange,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // weight log 남기기
    const weightLogsDocRef = doc(
      firestore,
      'users',
      userId,
      'weight',
      monthly,
      'weightLogs',
      inputDate,
    );
    // 문서 존재 여부 확인
    const docSnapshot2 = await getDoc(weightLogsDocRef);

    if (docSnapshot2.exists()) {
      batch.update(weightLogsDocRef, {
        lastchanges: newChange,
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.set(weightLogsDocRef, {
        date: inputDate,
        lastchanges: newChange,
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
