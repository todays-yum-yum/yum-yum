import React from 'react';
// 아이콘
import PlusIcon from '@/assets/icons/icon-plus.svg?react';
import MinusIcon from '@/assets/icons/icon-minus.svg?react';
import CheckIcon from '@/assets/icons/icon-check.svg?react';

export default function FoodItem({
  id,
  foodName,
  makerName,
  foodSize,
  foodUnit,
  nutrient,
  variant = 'select' /* select, delete */,
  selected = false,
  onSelect,
  onRemove,
  onOpenModal,
}) {
  // 체크 해제
  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.();
  };

  // 추가 선택
  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect?.();
  };

  // 삭제
  const handleDelete = (e) => {
    e.stopPropagation();
    onRemove();
  };
  return (
    <li
      onClick={onOpenModal}
      className='flex justify-between items-center py-5 border-b border-gray-200'
    >
      <div className='flex flex-col gap-1'>
        <h5>{foodName}</h5>

        <div className='flex gap-1 text-sm'>
          {makerName && <p className='text-gray-700'>{makerName}</p>}
          {/* <p className='text-gray-400'>
            1잔 ({foodSize}
            {foodUnit})
          </p> */}
          <p className='text-gray-400'>
            {foodSize}
            {foodUnit}
          </p>
        </div>
      </div>

      <div className='flex gap-3'>
        <div className='font-bold text-gray-500'>
          {typeof nutrient?.kcal === 'number' && !isNaN(nutrient.kcal)
            ? `${Math.round(nutrient.kcal)}kcal`
            : '-'}
        </div>

        <div className='flex items-center justify-center'>
          {variant === 'select' && (
            <>
              {selected ? (
                <button onClick={handleRemove}>
                  <CheckIcon className='text-primary' />
                </button>
              ) : (
                <button onClick={handleSelect}>
                  <PlusIcon className='text-[#CBE9DB] w-[24px] h-[24px]' />
                </button>
              )}
            </>
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
