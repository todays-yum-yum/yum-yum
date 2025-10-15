// services/userApi.js
import {
  doc,
  getDoc,
  setDoc,
  collection,
  where,
  getCountFromServer,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, firestore } from './firebase';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { calculateWaterIntake } from '../utils/calorieCalculator';

// 사용자 데이터 가져오기(전체 데이터)
export async function getUserData(userId) {
  try {
    const docRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
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

//-------------------------------------------------------

// 유저 로그인
export async function loginUser({ userid, password }) {
  // console.log('service userid, password check:', userid, password);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, userid, password);
    const user = userCredential.user;

    return {
      success: true,
      user,
    };
  } catch (error) {
    // throw new Error(error); // debug용
    if (error.code === 'auth/invalid-credential') {
      return {
        success: false,
        error: '아이디 혹은 비밀번호가 일치하지 않습니다.',
      };
    } else {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// 이메일 중복 체크
export async function checkUserEmail({ userId }) {
  try {
    const coll = collection(firestore, 'users');
    const checkQuery = query(coll, where('userId', '==', userId));
    const snapshot = await getCountFromServer(checkQuery);

    // 비용 효율을 위한 집계함수 사용(단순하게 있는지 없는지 구분)
    return snapshot.data().count > 0;
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    throw error;
  }
}

// Firebase Authentication 계정 생성
export async function registerUser({ email, pw }) {
  if (!email && !pw) {
    return {
      success: false,
      error: '빈값임',
    };
  }
  try {
    // Firebase Auth에 이메일/비밀번호로 계정 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email, pw);
    const user = userCredential.user;

    return {
      success: true,
      user,
    };
  } catch (error) {
    //throw new Error('ERROR: ', error); // debug 용
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * FireStore에 유저 정보 저장
 * @param {Object} user
 */
const userDocData = (user) => {
  return {
    userId: user.email, // email
    age: Number(user.age),
    gender: user.gender,
    goals: {
      goal: user?.goals,
      targetExercise: user.targetExercise,
      targetWeight: Number(user.targetWeight) || Number(user.weight), // 목표 체중이 없을 때 기존 체중과 동일하게 설정
    },
    height: Number(user.height),
    name: user.name,
    oneTimeIntake: 500,
    targetIntake: calculateWaterIntake(user.age, user.gender),
    weight: Number(user.weight),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
};
export async function addUserFireStore(user) {
  try {
    const userRef = doc(firestore, 'users', user.uid);
    const userData = userDocData(user);
    setDoc(userRef, userData);

    return {
      success: true,
      data: user.Uid,
    };
  } catch (error) {
    console.log('error 발생!', error);
    //throw new Error('ERROR: ', error); // debug 용
    return {
      success: false,
      error: error.message,
    };
  }
}

//------------------------------------------------------------

// 사용자 데이터 업데이트
export async function editProfile({ currentItem, newValue, userId }) {
  let fieldName = currentItem.id;
  if (fieldName === 'goal' || fieldName === 'targetExercise' || fieldName === 'targetWeight') {
    fieldName = `goals.${currentItem.id}`;
  }
  try {
    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, {
      [fieldName]: newValue,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      data: { fieldName: fieldName, newValue: newValue },
    };
  } catch (error) {
    console.error('업데이트 실패:', error);
  }
}

//

export async function deleteUserFireStore(userId) {
  const userRef = doc(firestore, 'users', userId);
}

export async function deleteAccount(user) {
  deleteUser(user)
    .then(() => {
      console.log('탈퇴가 완료되었습니다.');
    })
    .catch((error) => {
      console.log('에러가 발생했습니다.');
    });
}
