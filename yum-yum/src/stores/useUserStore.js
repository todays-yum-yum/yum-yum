import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      //상태
      user: null,
      isAuthenticated: true, //임시로 true 설정. 기본은 false
      isLoading: false,
      error: null,

      // 액션들
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // 로그인 상태 설정
      loginSuccess: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),

      loginFailure: (error) =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      // 초기화
      reset: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),
    }),
    // 로컬스토리지에 Uid와 로그인상태 저장
    {
      name: 'auth-storage', // localstorage key
      partialize: (state) => ({
        userId: state.user, //Uid
        isAuthenticated: state.isAuthenticated, //로그인 상태
      }),
    },
  ),
);
