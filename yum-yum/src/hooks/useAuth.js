// 유저 로그인 상태 확인 훅
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { loginUser } from '../services/userApi';
import { useUserStore } from '../stores/useUserStore';

export default function useAuth() {
  const {
    user,
    isAuthenticated, // default: false
    isLoading,
    error,
    setLoading,
    setError,
    clearError,
    loginSuccess,
    loginFailure,
    logout: logoutStore,
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

  // 이메일 인증

  // 회원가입

  return {
    isAuthenticated,
    login,
  };
}
