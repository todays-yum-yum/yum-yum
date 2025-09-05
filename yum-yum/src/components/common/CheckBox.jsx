// 커스텀 체크박스
import React from 'react';
import clsx from 'clsx';

export default function CheckBox({
  id = 1,
  disabled = false,
  checked = false,
  onChange,
  children,
  ...rest
}) {
  return (
    <label className='inline-flex justify-start items-center gap-2 overflow-hidden'>
      <input
        id={id}
        type='checkbox'
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        {...rest}
        className='sr-only' // 숨기고 접근성만 유지
      />
      <div
        className={clsx(
          'w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center',
          {
            'bg-primary border-primary': checked,
            'bg-white border-gray-300 hover:border-gray-400': !checked,
            'opacity-50 cursor-not-allowed': disabled,
          },
        )}
      >
        {checked && (
          <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        )}
      </div>
      {children}
    </label>
  );
}
