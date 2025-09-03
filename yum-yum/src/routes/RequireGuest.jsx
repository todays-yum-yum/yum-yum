// 비로그인 전용 라우터
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function RequireGuest({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }
  return children;
}
