// 메인 페이지 - 몸무게 설정 api 서비스
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase'; //firestore 초기화

// 몸무게 저장
export async function saveWeight({ userId, weight }) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error(`userId: ${userId}. 유저아이디는 string 값이어야 합니다.`);
    }
    if (!weight || typeof weight !== 'number') {
      throw new Error(`weight: ${weight}. 몸무게 값은 무조건 숫자값이어야 합니다.`);
    }

    await updateDoc(doc(firestore, 'users', userId), {
      weight: weight,
    });

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
