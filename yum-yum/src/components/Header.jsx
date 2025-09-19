import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 아이콘
import logo from '/logo.svg';
import PrevIcon from '@/assets/icons/icon-left.svg?react';

export default function Header() {
  const navigate = useNavigate();
  const isHeaderHiddenPage = location.pathname.startsWith('/meal'); // 헤더 없는 페이지
  const isBackHiddenPage = ['/', '/report', '/mypage', '/signup'].includes(location.pathname); // e뒤로가기 버튼 없는 페이지

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {!isHeaderHiddenPage && (
        <div className='sticky top-0 z-30 flex items-center h-[60px] px-5 border-b border-gray-200 bg-white'>
          {!isBackHiddenPage && (
            <button onClick={handleBack} className='flex items-center justify-center'>
              <PrevIcon className='h-[60px] mr-4' />
            </button>
          )}

          <h1>
            <Link to='/' className='flex items-center w-[84px] h-[60px]'>
              <img src={logo} alt='오늘의 냠냠' className='w-full' />
            </Link>
          </h1>
        </div>
      )}
    </>
  );
}
