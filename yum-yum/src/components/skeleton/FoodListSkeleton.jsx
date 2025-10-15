import React from 'react';

function FoodRowSkeleton() {
  return (
    <div className='flex items-center justify-between py-[24px] border-b border-gray-200'>
      <div className='flex flex-col gap-2 animate-pulse'>
        <div className='w-[100px] h-[16px] bg-gray-300 rounded' /> {/* 음식명 */}
        <div className='w-[40px] h-[16px] bg-gray-300 rounded' /> {/* 용량 */}
      </div>

      <div className='flex items-center gap-3'>
        <div className='w-[60px] h-[16px] bg-gray-300 rounded animate-pulse' /> {/* kcal */}
        <div className='w-[24px] h-[24px] rounded-full bg-gray-300 animate-pulse' />
        {/* + 버튼 */}
      </div>
    </div>
  );
}

export default function FoodListSkeleton({ count = 4, showHeader = false, className }) {
  return (
    <div className={className}>
      {showHeader && (
        <div className='flex items-center justify-between pt-[20px]'>
          <div className='w-[60px] h-[20px] bg-gray-300 rounded animate-pulse' />
          <div className='w-[28px] h-[20px] bg-gray-300 rounded animate-pulse' />
        </div>
      )}

      {Array.from({ length: count }).map((_, i) => (
        <FoodRowSkeleton key={i} />
      ))}
    </div>
  );
}
