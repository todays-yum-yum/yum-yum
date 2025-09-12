import React from 'react';
import clsx from 'clsx';
import { motiveMessage } from '@/data/motivateMessage';

export default function CalorieMessage({ currentCalories = 0, totalCalories = 0 }) {
  const remainingCalories = currentCalories - totalCalories;
  const getCalorieMessage = (currentCalories, remainingCalories) => {
    // 아직 섭취한 칼로리가 없는 경우
    if (currentCalories === 0) {
      return motiveMessage.empty;
    }
    // 목표 칼로리 초과
    if (remainingCalories > 0) {
      return motiveMessage.overgoal;
    }
    // 목표 칼로리 미달
    if (remainingCalories < 0) {
      return motiveMessage.undergoal;
    }
    // 목표 칼로리 정확히 달성
    return motiveMessage.donegoal;
  };
  const message = getCalorieMessage(currentCalories, remainingCalories);

  return (
    <div className='text-center mb-4 '>
      <span
        className={clsx(
          { 'text-gray-800 text-2xl font-extrabold': currentCalories !== totalCalories },
          {
            'text-gray-800 text-xl font-bold':
              currentCalories === totalCalories || currentCalories === 0,
          },
        )}
      >
        {message}
      </span>
      {currentCalories !== 0 && currentCalories !== totalCalories && (
        <>
          <span
            className={clsx(
              'text-3xl font-extrabold',
              { 'text-primary': currentCalories <= totalCalories },
              { 'text-secondary-dark': currentCalories > totalCalories },
            )}
          >
            {' '}
            {Math.abs(remainingCalories)}{' '}
          </span>
          <span className='text-gray-800 text-2xl font-extrabold'>kcal</span>
        </>
      )}
    </div>
  );
}
