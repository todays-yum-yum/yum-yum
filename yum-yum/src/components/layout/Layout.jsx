// 전역 레이아웃 컴포넌트
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../Header';
import BottomBar from '../BottomBar';

export default function Layout() {
  return (
    <div>
      <Header />
      <Toaster position='top-center' reverseOrder={false} />
      <main>
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
