import clsx from 'clsx';
import React from 'react';

export default function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  status = 'default', // 'default' | 'error'
  endAdornment = null,
  onAdornmentClick = null,
  errorMessage = '',
  ...rest
}) {
  return (
    <div className='flex flex-col gap-1 w-full'>
      <div className='relative'>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
          className={clsx(
            'input-base',
            endAdornment && 'input-with-adornment',
            status === 'error' && 'input-error',
          )}
        />

        {/* 아이콘, 서브 텍스트 위치 */}
        {endAdornment && (
          <button
            type='button'
            onClick={onAdornmentClick}
            className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'
          >
            {endAdornment}
          </button>
        )}
      </div>

      {status === 'error' && errorMessage && (
        <p className='text-[var(--color-error)] text-sm'>{errorMessage}</p>
      )}
    </div>
  );
}
