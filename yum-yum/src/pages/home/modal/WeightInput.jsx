import React from 'react';

export default function WeightInput({ register, errors }) {
  return (
    <div className='py-10 flex justify-center items-end gap-1'>
      <div className='flex flex-col items-center gap-1'>
        <input
          type='number'
          className='w-28 text-gray-800 text-5xl font-extrabold text-center border-none outline-none no-spinner'
          placeholder='0'
          step='0.1'
          min='20'
          max='300'
          {...register('weight', {
            required: '체중을 입력해주세요',
            min: { value: 20, message: '올바른 체중을 입력해주세요' },
            max: { value: 300, message: '300kg 이하로 입력해주세요' },
            pattern: {
              value: /^\d+\.?\d*$/,
              message: '숫자만 입력해주세요.',
            },
            pattern: {
              value: /^(?:\d{1,3}(?:.\d)?|)$/,
              message: '소수점 첫째 자리까지 입력 가능합니다',
            },
          })}
        />
        {errors?.weight && (
          <div className='absolute mt-16 text-sm text-red-500'>{errors.weight.message}</div>
        )}
      </div>
      <div className='text-gray-700 text-xl font-normal'>kg</div>
    </div>
  );
}
