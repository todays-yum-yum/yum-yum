import React from 'react';
import BasicButton from '@/components/button/BasicButton';

export default function CalorieHeader() {
  return (
    <div className='flex justify-between items-center mb-6 sm:mb-8'>
      <h2 className='text-gray-800 text-xl sm:text-2xl font-extrabold'>오늘의 칼로리</h2>
      <BasicButton size='xs' variant='line' onClick={() => {}}>
        전체보기
      </BasicButton>
    </div>
  );
}
