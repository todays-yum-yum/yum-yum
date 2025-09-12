/** 전역 라우팅 설정 / 레이아웃  */
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Navigate, Outlet, RouterProvider } from 'react-router';

import HomePage from '@/pages/home/HomePage';
import MealPage from '@/pages/meal/MealPage';
import ReportPage from '@/pages/report/pages/ReportPage';
import WaterPage from '@/pages/water/WaterPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import NonUserHomePage from '@/pages/home/NonUserHomePage';
import SimpleLayout from '@/components/layout/SimpleLayout';
import Layout from '@/components/layout/Layout';
import RequireGuest from '@/routes/RequireGuest';
import RequireAuth from '@/routes/RequireAuth';
import CustomEntryForm from './pages/meal/page/CustomEntryForm';
import TotalMeal from './pages/meal/page/TotalMeal';
// import SearchList from './pages/meal/page/SearchList';

const router = createBrowserRouter([
  {
    element: <Outlet />, // 최상위 공통
    children: [
      // 1) 로그인된 사용자 전용
      {
        element: (
          <RequireAuth>
            <Layout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <HomePage /> },
          { path: 'meal/:type', element: <MealPage /> }, // 아침, 점심, 저녁, 기타 타입
          { path: 'meal/custom', element: <CustomEntryForm /> },
          // { path: 'meal/search', element: <SearchList /> },
          { path: 'meal/:type/total', element: <TotalMeal /> },
          { path: 'report', element: <ReportPage /> },
          { path: 'water', element: <WaterPage /> },
        ],
      },

      // 2) 게스트(비로그인) 전용
      {
        element: (
          <RequireGuest>
            <SimpleLayout />
          </RequireGuest>
        ),
        children: [
          // 비로그인용 홈이 따로 필요하면 index 로 달아주고
          { path: 'nonmember', element: <NonUserHomePage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignUpPage /> },
        ],
      },

      // 3) 그 외 모든 경로 → 최상위 홈 (로그인 돼 있으면 HomePage, 안 돼 있으면 NonUserHome)
      {
        path: '*',
        element: <Navigate to='/' replace />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
