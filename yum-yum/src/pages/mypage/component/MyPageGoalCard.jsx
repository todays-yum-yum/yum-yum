import React from 'react';

export function GoalItem({ itemKey, value }) {
  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <span className='text-base font-bold text-gray-500'>{itemKey}</span>
      <span className='text-base font-bold'>{value}</span>
    </div>
  );
}

export default function MyPageGoalCard({ goals }) {
  const goalItems = Object.entries(goals);

  return (
    <div className='flex flex-row justify-between items-center'>
      {goalItems.map(([key, value], index) => (
        <React.Fragment key={key}>
          <GoalItem key={key} itemKey={key} value={value} />
          {index < goalItems.length - 1 && <div className='w-px h-6 bg-gray-300 mx-2' />}
        </React.Fragment>
      ))}
    </div>
  );
}
