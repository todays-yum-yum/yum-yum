import React from 'react';

export default function CalorieNutrition({ carbs = 0, protein = 0, fat = 0 }) {
  return (
    <div className='flex flex-row gap-8 item-center justify-center mt-[-30px] mb-4'>
      <div className='flex gap-1 item-center justify-center'>
        <div className='text-gray-800 text-sm font-normal'>탄</div>
        <div className='text-gray-800 text-sm font-bold'>{carbs.toFixed(1)}g</div>
      </div>
      <div className='flex gap-1 item-center justify-center'>
        <div className='text-gray-800 text-sm font-normal'>단</div>
        <div className='text-gray-800 text-sm font-bold'>{protein.toFixed(1)}g</div>
      </div>
      <div className='flex gap-1 item-center justify-center'>
        <div className='text-gray-800 text-sm font-normal'>지</div>
        <div className='text-gray-800 text-sm font-bold'>{fat.toFixed(1)}g</div>
      </div>
    </div>
  );
}
