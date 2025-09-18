// services/userApi.js
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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

// Firebase Authentication 계정 생성
export async function registerUser({ username, userid, password }) {
  try {
    // Firebase Auth에 이메일/비밀번호로 계정 생성
    const userCredential = await createUserWithEmailAndPassword(auth, userid, password);
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
    Uid: user.Uid,
    userId: user.userId,
    age: user.age,
    gender: user.gender,
    goals: { targetExercise: user.targetExercise, targetWeight: user.targetWeight },
    height: user.height,
    name: user.name,
    oneTimeIntake: 500,
    targetIntake: 1000,
    weight: user.weight,
  };
};
export async function addUserFireStroe(user) {
  console.log(user);
  try {
    const userRef = doc(firestore, 'users', user.Uid);
    const userData = userDocData(user);
    setDoc(userRef, userData);

    return {
      success: true,
      data: user.Uid,
    };
  } catch (error) {
    throw new Error('ERROR: ', error); // debug 용
    // return {
    //   success: false,
    //   error: error.message
    // }
  }
}
