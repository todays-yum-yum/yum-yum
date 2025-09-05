// 전역 레이아웃 컴포넌트
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../Header';
import BottomBar from '../BottomBar';
import sideLogo from '@/assets/images/side-logo-pc.png';

export default function Layout() {
  return (
    <div className='min-h-screen'>
      <div className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ml-[-500px] mt-[-60px] md:hidden xl:block'>
        <img src={sideLogo} alt='오늘의 냠냠' />
      </div>

      <div className='relative flex flex-col w-full max-w-[500px] min-h-screen mx-auto bg-white shadow-lg'>
        <Header />

        <Toaster position='top-center' reverseOrder={false} />

        <main className='flex-1'>
          <Outlet />
        </main>

        <BottomBar />
      </div>
    </div>
  );
}
