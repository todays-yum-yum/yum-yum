// 유저 로그인 & 회원가입 상태 확인 훅
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { checkUserEmail, loginUser, registerUser, addUserFireStore } from '../services/userApi';
import { useUserStore } from '../stores/useUserStore';

export default function useAuth() {
  const {
    isAuthenticated, // default: false
    setLoading,
    setError,
    clearError,
    loginSuccess, // 로그인 성공 시 (set)
    loginFailure, // 로그인 실패 시 (set)
    logout: logoutStore, // 로그아웃 시(set)
    checkEmail: checkResult, // 이메일 체크한 결과 값(set)
    signupSuccess,
    signupFailure,
  } = useUserStore();

  // 로그인
  const login = useCallback(
    async (userId, password) => {
      setLoading(true);
      clearError();

      const result = await loginUser({ userid: userId, password });
      // console.log(result);
      if (result.success) {
        loginSuccess(result.user.uid);
        toast.success('로그인 성공!');
        return { success: true };
      } else {
        loginFailure(result.error);
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    },
    [setLoading, clearError, loginSuccess, loginFailure],
  );

  // 이메일 중복확인
  const checkEmail = useCallback(async (userId) => {
    setLoading(true);
    clearError();
    const result = await checkUserEmail({ userId });
    console.log(result);
    return {
      result: result,
      message: result ? '중복된 이메일입니다.' : '사용가능한 이메일입니다.',
    };
  });

  // 회원가입
  const signUp = useCallback(async (user) => {
    setLoading(true);
    clearError();

    // Firebase Authentication 계정 생성
    const createUserId = await registerUser(user);

    // uid를 포함한 새로운 객체 생성
    const userWithUid = {
      ...user,
      uid: createUserId.user.uid,
    };

    // FireStore 유저 정보 저장
    const result = await addUserFireStore(userWithUid);
    if (result.success) {
      signupSuccess(userWithUid);
    } else {
      signupFailure(result);
    }
  });

  return {
    isAuthenticated,
    login,
    checkEmail,
    signUp,
  };
}
