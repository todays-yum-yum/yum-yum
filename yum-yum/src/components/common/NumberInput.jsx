// 숫자 입력 + 유닛표출 컴포넌트
import React from 'react';

export default function NumberInput({
  name,
  register,
  errors,
  placeholder = '0',
  unit = '',
  step = '0.1',
  min = 0,
  max = 999,
  validationRules = {},
  className = '',
}) {
  // 기본 validation 규칙
  const defaultRules = {
    required: `${name}을(를) 입력해주세요`,
    min: { value: min, message: `${min} 이상의 값을 입력해주세요` },
    max: { value: max, message: `${max} 이하의 값을 입력해주세요` },
    pattern: {
      value: /^\d+\.?\d*$/,
      message: '숫자만 입력해주세요.',
    },
    ...validationRules, // 커스텀 규칙으로 덮어쓰기
  };

  return (
    <div className={`py-10 flex justify-center items-end gap-1 ${className}`}>
      <div className='flex flex-col items-center gap-1'>
        <input
          type='number'
          className='w-28 text-gray-800 text-5xl font-extrabold text-center border-none outline-none no-spinner'
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          {...register(name, defaultRules)}
        />
        {errors?.[name] && (
          <div className='absolute mt-16 text-sm text-red-500'>{errors[name].message}</div>
        )}
      </div>
      {unit && <div className='text-gray-700 text-xl font-normal'>{unit}</div>}
    </div>
  );
}
