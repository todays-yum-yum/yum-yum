import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth(); // 실제 인증 상태에 따라 변경 필요
  const loc = useLocation();

  if (!isAuthenticated) {
    // 로그인이 안되어 비회원 메인페이지로 이동
    return <Navigate to='/nonmember' state={{ from: loc }} replace />;
  }
  return children;
}
