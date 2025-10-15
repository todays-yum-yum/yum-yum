import React from 'react';
// 컴포넌트
import CheckBox from '@/components/common/CheckBox';
// 아이콘
import NextIcon from '@/assets/icons/icon-right.svg?react';

export default function AgreementItem({
  id,
  label,
  checked,
  onChange,
  isNext = false,
  isAll = false,
  onOpenModal,
  type,
}) {
  return (
    <div className='flex items-center justify-between gap-2'>
      <label
        htmlFor={id}
        className={`flex items-center gap-[12px] flex-1 cursor-pointer 
                    ${isAll ? 'border-b border-gray-300 pb-[20px] mb-[20px]' : ''}
                  `}
      >
        <div className='w-5 h-5'>
          <CheckBox id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
        </div>

        <p className={`${isAll ? 'font-bold text-lg' : 'text-gray-600 '}`}>{label}</p>
      </label>

      {isNext && (
        <button
          type='button'
          onClick={() => onOpenModal?.(type)}
          className='flex items-center justify-center'
        >
          <NextIcon className='ml-3' />
        </button>
      )}
    </div>
  );
}
