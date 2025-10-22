import React from 'react';

export default function DateSelector({
  onCalendarClick,
  formattedDate,
  dateStringShort,
  isReport,
  textSize,
}) {
  return (
    <>
      <h1 className={`text-black text-xl font-bold whitespace-nowrap ${textSize}`}>
        {isReport ? dateStringShort : formattedDate}
      </h1>

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
    </>
  );
}
