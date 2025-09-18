import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import '@/styles/index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패 시 재시도 횟수
      refetchOnWindowFocus: false, // 창이 다시 포커스될 때마다 재요청하지 않음
    },
  },
});

createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </CookiesProvider>,

