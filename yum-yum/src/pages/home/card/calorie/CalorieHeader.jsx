import React from 'react';
import BasicButton from '@/components/button/BasicButton';
import { useNavigate } from 'react-router-dom';

export default function CalorieHeader() {
  const navigate = useNavigate();
  return (
    <div className='flex justify-between items-center mb-6 '>
      <h2 className='text-gray-800 text-2xl font-extrabold'>오늘의 칼로리</h2>
      <BasicButton
        size='xs'
        variant='line'
        onClick={() => {
          navigate('/report', { replace: true });
        }}
      >
        전체보기
      </BasicButton>
    </div>
  );
}
