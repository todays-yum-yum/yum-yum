import React from 'react';
// 아이콘
import SearchIcon from '@/assets/icons/icon-search.svg?react';

export default function SearchBar({
  value,
  onChange,
  placeholder = '음식명을 입력해주세요.',
  className = '',
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full h-[48px] pr-[40px] pl-[16px] border border-gray-300 bg-white rounded-lg outline-none focus:border-secondary transition-colors'
      />

      <button
        aria-label='직접 등록한 음식 검색'
        className='absolute right-3 flex items-center justify-center'
      >
        <SearchIcon />
      </button>
    </div>
  );
}
