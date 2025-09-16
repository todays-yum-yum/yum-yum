// 유저 로그인 상태 확인 훅
import { useState } from 'react';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 초기값을 true로 설정 (임시)

  // 이곳에서 쿠키를 확인하여 로그인 상태를 업데이트

  return { isAuthenticated };
}
