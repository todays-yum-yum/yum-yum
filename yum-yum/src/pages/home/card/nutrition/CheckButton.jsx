import React from 'react';
import clsx from 'clsx';

export default function CheckButton({ hasData = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:scale-105',
        hasData ? 'bg-secondary hover:bg-secondary-hover' : 'bg-primary hover:bg-primary-hover',
      )}
    >
      {hasData ? (
        // 편집 아이콘 (빨간색)
        <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z' />
        </svg>
      ) : (
        // 추가 아이콘 (초록색)
        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
        </svg>
      )}
    </button>
  );
}
