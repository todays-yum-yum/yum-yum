import React from 'react';

export default function CalorieNutrition({ carbs = 27.8, protein = 5.7, fat = 7.2 }) {
  return (
    <div className='grid grid-cols-3 gap-4 text-center'>
      <div>
        <div className='text-gray-800 text-sm font-normal'>탄수화물</div>
        <div className='text-gray-800 text-sm font-bold'>{carbs}g</div>
      </div>
      <div>
        <div className='text-gray-800 text-sm font-normal'>단백질</div>
        <div className='text-gray-800 text-sm font-bold'>{protein}g</div>
      </div>
      <div>
        <div className='text-gray-800 text-sm font-normal'>지방</div>
        <div className='text-gray-800 text-sm font-bold'>{fat}g</div>
      </div>
    </div>
  );
}
