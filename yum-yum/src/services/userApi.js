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
} from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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
    throw new Error(error); // debug용
    /*
      return {
        success: false,
        error: error.message
      }
    */
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
    throw new Error('ERROR: ', error); // debug 용
    // return {
    //   success: false,
    //   error: error.message
    // }
  }
}

/**
 * FireStore에 유저 정보 저장
 * @param {Object} user
 */
const userDocData = (user) => {
  return {
    userId: user.email, // email
    age: user.age,
    gender: user.gender,
    goals: {
      goal: user?.goals,
      targetExercise: user.targetExercise,
      targetWeight: user.targetWeight,
    },
    height: user.height,
    name: user.name,
    oneTimeIntake: 500,
    targetIntake: calculateWaterIntake(user.age, user.gender),
    weight: user.weight,
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
    throw new Error('ERROR: ', error); // debug 용
    // return {
    //   success: false,
    //   error: error.message
    // }
  }
}
