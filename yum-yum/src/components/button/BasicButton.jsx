// 일반버튼 컴포넌트
import React from 'react';
import clsx from 'clsx';

export default function BasicButton({
  size = 'md', // sm, md, lg, xl, full
  color = 'primary', // primary, secondary, gray
  variant = 'filled', // filled, line
  disabled = false,
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // h-12 px-5 bg-emerald-500 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden
      className={clsx('rounded flex justify-center items-center', {
        'px-2 h-8': size === 'xs',
        'px-2 h-12': size === 'sm',
        'px-5 h-12': size === 'md',
        'px-8 h-12': size === 'lg',
        'px-11 h-12': size === 'xl',
        'w-full h-12': size === 'full',
        'bg-primary text-white': color === 'primary' && variant === 'filled' && !disabled,
        'bg-secondary text-white': color === 'secondary' && variant === 'filled' && !disabled,
        'bg-gray-600 text-white': color === 'gray' && variant === 'filled' && !disabled,
        'border border-primary text-primary':
          color === 'primary' && variant === 'line' && !disabled,
        'border border-secondary text-secondary':
          color === 'secondary' && variant === 'line' && !disabled,
        'border border-gray-600 text-gray-300': color === 'gray' && variant === 'line',
        'bg-gray-300 text-white cursor-not-allowed': disabled,
      })}
    >
      {children}
    </button>
  );
}
