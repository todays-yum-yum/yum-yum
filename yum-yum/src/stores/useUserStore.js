import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      //상태
      user: null, // 회원가입 할 때, 목표설정 전 회원 정보 저장
      userId: null,
      isAuthenticated: false, //임시로 true 설정. 기본은 false
      isLoading: false,
      error: null,
      checkResult: null, // 이메일 중복확인 결과

      // 액션들
      setUser: (user) =>
        set({
          user: user,
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      /* 로그인 설정 */
      // 로그인 상태 설정
      loginSuccess: (user) =>
        set({
          userId: user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),

      loginFailure: (error) =>
        set({
          userId: null,
          isAuthenticated: false,
          isLoading: false,
          error,
        }),

      logout: () =>
        set({
          userId: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      /* 회원가입 액션 */
      checkEmail: (result) =>
        set({
          checkResult: result,
          isLoading: false,
        }),

      signupSuccess: ({ uid }) =>
        set({
          user: null, // 회원가입한 사용자 정보
          userId: uid, // 회원가입한 사용자 ID
          checkResult: null, // 이메일 중복확인 결과 초기화
          isAuthenticated: true, // 바로 로그인 상태로
          isLoading: false,
          error: null,
        }),

      signupFailure: ({ error }) =>
        set({
          isLoading: false,
          error,
          // user 정보는 유지 (재시도를 위해)
        }),

      /* 초기화 액션들 */
      // 로그인, 가입 등 전체 초기화
      reset: () =>
        set({
          user: null,
          userId: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      // 로그인 초기화
      loginReset: () =>
        set({
          userId: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      // 회원가입 유저 정보 초기화
      authReset: () =>
        set({
          user: null,
          isLoading: false,
          error: null,
        }),
    }),
    // 로컬스토리지에 Uid와 로그인상태 저장
    {
      name: 'auth-storage', // localstorage key
      partialize: (state) => ({
        userId: state.userId, //Uid
        isAuthenticated: state.isAuthenticated, //로그인 상태
      }),
    },
  ),
);
