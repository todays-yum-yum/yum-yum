// 플로팅 버튼 컴포넌트
import React from 'react';
import IconPlus from '@/assets/icons/icon-plus-line.svg?react';
import IconClose from '@/assets/icons/icon-close.svg?react';
import IconDrop from '@/assets/icons/icon-drop.svg?react';
import IconMeal from '@/assets/icons/icon-restaurant.svg?react';
import { useNavigate } from 'react-router-dom';

export default function FloatButton({ onClick, isOpen, isClose, disabled }) {
  const navigate = useNavigate();
  return (
    <>
      {/* 플로팅 버튼 클릭했을 때 위에 뜨는 메뉴들 */}
      {isOpen && (
        <div className='fixed bottom-35 right-4 space-y-2 flex flex-col z-50'>
          <button
            onClick={() => {
              navigate('/water');
            }}
            className='p-2 px-4 rounded bg-gray-800 rounded-full text-white shadow-lg flex justify-center items-center space-x-2'
          >
            <IconDrop className='w-6 h-6' />
            <span className='pl-2'>물 추가하기</span>
          </button>
          <button
            onClick={() => {}}
            className='p-2 px-4 rounded bg-gray-800 rounded-full text-white shadow-lg flex justify-center items-center space-x-2'
          >
            <IconMeal className='w-6 h-6' />
            <span className='pl-2'>식단 추가하기</span>
          </button>
        </div>
      )}
      {/* 플로팅 버튼 */}
      <button
        className='fixed bottom-20 right-4 p-3 rounded-full bg-primary text-white shadow-lg'
        onClick={isClose}
        disabled={disabled}
      >
        {isOpen ? (
          <IconClose width='24' height='24' fill='#ffffff' />
        ) : (
          <IconPlus width='24' height='24' fill='#ffffff' />
        )}
      </button>
    </>
  );
}
