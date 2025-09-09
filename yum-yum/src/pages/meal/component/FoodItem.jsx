import React from 'react';
// 아이콘
import PlusIcon from '@/assets/icons/icon-plus.svg?react';
import MinusIcon from '@/assets/icons/icon-minus.svg?react';
import CheckIcon from '@/assets/icons/icon-check.svg?react';

export default function FoodItem({
  id,
  foodName,
  makerName,
  foodWeight,
  foodCal,
  variant = 'select' /* select, delete */,
  selected = false,
  onToggleSelect,
  onDelete,
  onClick,
}) {
  const handleSelected = (e) => {
    e.stopPropagation();
    onToggleSelect?.();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };
  return (
    <li
      onClick={onClick}
      className='flex justify-between items-center py-5 border-b border-gray-200'
    >
      <div className='flex flex-col gap-1'>
        <h5>{foodName}</h5>

        <div className='flex gap-1 text-sm'>
          {makerName && <p className='text-gray-700'>{makerName}</p>}
          <p className='text-gray-400'>1잔 ({foodWeight}ml)</p>
        </div>
      </div>

      <div className='flex gap-3'>
        {/* 칼로리 */}
        <div className='font-bold text-gray-500'>{foodCal}kcal</div>

        <div className='flex items-center justify-center'>
          {variant === 'select' && (
            <button onClick={handleSelected} className='flex items-center justify-center'>
              {selected ? (
                <CheckIcon className='text-primary' />
              ) : (
                <PlusIcon className='text-[#CBE9DB] w-[24px] h-[24px]' />
              )}
            </button>
          )}

          {variant === 'delete' && (
            <button onClick={handleDelete} className='flex items-center justify-center'>
              <MinusIcon className='text-primary w-[24px] h-[24px]' />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
