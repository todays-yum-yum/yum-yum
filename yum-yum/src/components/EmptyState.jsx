import React from 'react';
// 컴포넌트
import RoundButton from './button/RoundButton';
// 아이콘
import NoResultIcon from '@/assets/icons/icon-noresult.svg?react';

export default function EmptyState({
  children = 'Not Found',
  className = '',
  btn = false,
  btnClick,
}) {
  const isDefault = children === 'Not Found';
  const isStyle = className === '';

  return (
    <div
      className={`flex flex-col gap-7 items-center justify-center ${isStyle ? 'h-screen' : className}`}
    >
      <div className='flex items-center justify-center'>
        <NoResultIcon />
      </div>

      <p className={`text-gray-500 ${isDefault ? 'text-4xl font-bold' : 'text-md font-semibold'}`}>
        {children}
      </p>

      {btn && (
        <RoundButton size='lg' color='secondary' onClick={btnClick}>
          {btn}
        </RoundButton>
      )}
    </div>
  );
}
