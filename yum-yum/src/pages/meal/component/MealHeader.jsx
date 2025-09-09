import React from 'react';
import { useNavigate } from 'react-router-dom';
// 아이콘
import PrevIcon from '@/assets/icons/icon-left.svg?react';
import SearchIcon from '@/assets/icons/icon-search.svg?react';

export default function FoodSearch({
  variant = 'title',
  children,
  isRight = false,
  value,
  onChange,
  handleSearchSubmit,
}) {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='sticky top-0 z-30 flex justify-center items-center h-[60px] px-5 py-2 bg-white'>
      <button onClick={handleBack} className='absolute left-[20px] flex items-center'>
        <PrevIcon className='h-[44px] mr-4' />
      </button>

      {variant === 'title' ? (
        <h2 className='font-bold text-lg'>{children}</h2>
      ) : (
        <div className='flex items-center gap-3 w-full ml-[26px] px-4 bg-gray-100 rounded-full '>
          <button onClick={handleSearchSubmit} className='flex items-center justify-center'>
            <SearchIcon />
          </button>

          <input
            type='text'
            placeholder='음식 검색'
            value={value}
            onChange={onChange}
            className='w-full h-[44px] outline-none'
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit();
            }}
          />
        </div>
      )}

      {isRight && (
        <span className='absolute right-[20px] text-sm text-gray-500'>
          <strong className='text-secondary'>*</strong> 필수 입력
        </span>
      )}
    </div>
  );
}
