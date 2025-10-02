import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import IconNoresult from '@/assets/icons/icon-noresult.svg?react';
import DateSelector from './DateSelector';

export default function DateHeader({
  date = new Date(),
  dateString,
  dateFormat = 'yyyy년 MM월 dd일',
  showOnBoardIcon = true,
  onCalendarClick,
  onOnBoardClick,
  className = '',
  textSize = '',
}) {

  const formattedDate = dateString || format(date, dateFormat, { locale: ko });

  return (
    <div className={`w-full h-16 bg-white  ${className}`}>
      {/* Flexbox 컨테이너 */}
      <div className='h-full flex items-center justify-between px-4'>
        {/* 왼쪽 빈 공간 (균형 맞추기 위해) */}
        <div className='w-7 h-7'></div>

        {/* 중앙: 날짜 + 캘린더 버튼 */}
        <div className='flex items-center gap-2'>
          <DateSelector onCalendarClick={onCalendarClick} formattedDate={formattedDate} textSize={textSize} />
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
