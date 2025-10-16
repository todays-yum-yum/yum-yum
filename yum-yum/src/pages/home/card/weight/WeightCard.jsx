import React from 'react';
import BasicButton from '@/components/button/BasicButton';

export default function WeightCard({
  currentWeight = 0,
  targetWeight = 0,
  onWeightInput,
  isExacDate,
  displayText = '',
}) {
  const remainingWegiht = targetWeight - currentWeight;
  const isGoalReached = remainingWegiht == 0;

  return (
    <div className='p-6 sm:p-8'>
      {/* 헤더 영역 */}
      <div className='flex justify-between items-start mb-2'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4'>
            <h2 className='text-gray-800 text-2xl font-extrabold text-nowrap'>체중</h2>
            {!isExacDate && (
              <span className='text-gray-500 text-sm font-bold max-[390px]:text-xs text-pretty'>
                {displayText}
              </span>
            )}
          </div>
          {/* 체중 정보 */}
          <div className='space-y-3 mb-8'>
            <div className='flex justify-start items-center gap-2'>
              <span className='text-gray-800 text-mb font-bold max-[365px]:text-sm'>현재 체중</span>
              <span className='text-gray-800 text-mb font-bold max-[365px]:text-sm'>
                {parseFloat(currentWeight)?.toFixed(1)}kg
              </span>
            </div>

            <div className='flex justify-start items-center gap-2'>
              <span className='text-gray-800 text-mb font-bold max-[365px]:text-sm'>목표 체중</span>
              <span className='text-gray-800 text-mb font-bold max-[365px]:text-sm'>
                {parseFloat(targetWeight)?.toFixed(1)}kg
              </span>
            </div>
          </div>
        </div>

        {/* 목표까지 남은 무게 박스 */}
        <div
          className={`rounded-[20px] p-6  text-center flex-shrink-0 max-[365px]:max-w-[128px]
            ${isGoalReached ? 'bg-blue-100' : 'bg-pink-100'} `}
        >
          <div className='text-gray-800 text-mb  font-bold leading-tight mb-3 max-[365px]:text-sm mb-2'>
            {isGoalReached ? '목표 달성!' : '목표 무게까지'}
          </div>
          <div
            className={`text-3xl font-bold leading-tight max-[365px]:text-2xl ${
              isGoalReached ? 'text-primary' : 'text-secondary'
            }`}
          >
            {/* 감소는 - 증가는 + 표시 */}
            {isGoalReached
              ? '완료!'
              : remainingWegiht && remainingWegiht < 0
                ? `${remainingWegiht?.toFixed(1)}kg!`
                : `+${remainingWegiht?.toFixed(1)}kg!`}
          </div>
        </div>
      </div>

      {/* 체중 입력 버튼 */}
      <BasicButton variant='line' size='full' onClick={onWeightInput}>
        체중 입력
      </BasicButton>
    </div>
  );
}
