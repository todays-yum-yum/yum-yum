import React from 'react';
// 아이콘
import NoResultIcon from '@/assets/icons/icon-noresult.svg?react';

export default function EmptyState({ children = 'Not Found' }) {
  const isDefault = children === 'Not Found';
  return (
    <div className='flex flex-col gap-7 items-center justify-center h-[calc(100vh-180px)]'>
      <div className='flex items-center justify-center'>
        <NoResultIcon />
      </div>

      <p className={`text-gray-500 ${isDefault ? 'text-4xl font-bold' : 'text-md font-normal'}`}>
        {children}
      </p>
    </div>
  );
}
