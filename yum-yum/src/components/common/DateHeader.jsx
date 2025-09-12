import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import IconNoresult from '@/assets/icons/icon-noresult.svg?react';

export default function DateHeader({
  date = new Date(),
  dateFormat = 'yyyy년 MM월 dd일',
  showOnBoardIcon = true,
  onCalendarClick,
  onOnBoardClick,
  className = '',
}) {
  const formattedDate = format(date, dateFormat, { locale: ko });

  return (
    <div className={`w-full h-16 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${className}`}>
      {/* Flexbox 컨테이너 */}
      <div className='h-full flex items-center justify-between px-4'>
        {/* 왼쪽 빈 공간 (균형 맞추기 위해) */}
        <div className='w-7 h-7'></div>

        {/* 중앙: 날짜 + 캘린더 버튼 */}
        <div className='flex items-center gap-2'>
          <h1 className='text-black text-xl font-bold whitespace-nowrap'>{formattedDate}</h1>

          {/* 날짜 옆 캘린더 버튼 */}
          <button
            className='w-7 h-7 flex items-center justify-center
                       hover:bg-gray-100 rounded-md transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-300'
            onClick={onCalendarClick}
            aria-label='날짜 선택'
          >
            <svg className='w-4 h-4' viewBox='0 0 12 10' fill='currentColor'>
              <path d='M6 10L0 0h12L6 10z' className='text-emerald-500' />
            </svg>
          </button>
        </div>

        {/* 오른쪽: 온보딩 버튼 */}
        {showOnBoardIcon && (
          <button
            className='w-7 h-7 flex items-center justify-center
                       hover:bg-gray-100 rounded-md transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-300'
            onClick={onOnBoardClick}
            aria-label='온보딩 가이드'
          >
            {/* 온보딩 아이콘  */}
            <IconNoresult width={24} height={24} />
          </button>
        )}

        {/* showOnBoardIcon이 false일 때 균형 맞추기 */}
        {!showOnBoardIcon && <div className='w-7 h-7'></div>}
      </div>
    </div>
  );
}
