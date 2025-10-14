import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// 컴포넌트
import BasicButton from '@/components/button/BasicButton';
import Input from '@/components/common/Input';

export default function SignupStep2({ onPrev, onNext }) {
  const { control, handleSubmit } = useFormContext();

  // 성별
  const genderOption = [
    { value: 'female', label: '여성' },
    { value: 'male', label: '남성' },
  ];

  return (
    <>
      <div className='flex flex-col gap-[28px] px-[20px] min-h-[calc(100vh-220px)]'>
        {/* 성별 */}
        <Controller
          name='gender'
          control={control}
          rules={{
            required: '성별을 선택해주세요',
          }}
          render={({ field, fieldState }) => (
            <div className='flex flex-col gap-[8px]'>
              <label htmlFor='gender' className='text-sm font-bold text-gray-500'>
                성별 <strong className='text-secondary font-extrabold'>*</strong>
              </label>
              <div className='flex gap-[12px]'>
                {genderOption.map((gender) => (
                  <BasicButton
                    key={gender.value}
                    type='button'
                    size='full'
                    variant={field.value === gender.value ? 'filled' : 'line'}
                    onClick={() => {
                      field.onChange(gender.value);
                    }}
                  >
                    {gender.label}
                  </BasicButton>
                ))}
              </div>
              {fieldState.error && (
                <p className='text-[var(--color-error)] text-sm'>{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        {/* 나이 */}
        <Controller
          name='age'
          control={control}
          rules={{
            required: '나이를 입력해주세요',
            pattern: {
              value: /^[0-9]+$/,
              message: '숫자만 입력 가능합니다',
            },
            min: { value: 14, message: '14세 이상만 가입 가능해요.' },
            max: { value: 120, message: '나이를 다시 확인해주세요.' },
          }}
          render={({ field, fieldState }) => (
            <div className='flex flex-col gap-[8px]'>
              <label htmlFor='age' className='text-sm font-bold text-gray-500'>
                나이 <strong className='text-secondary font-extrabold'>*</strong>
              </label>
              <Input
                {...field}
                id='age'
                type='number'
                noSpinner
                placeholder='0'
                endAdornment='세'
                status={fieldState.error ? 'error' : 'default'}
                errorMessage={fieldState.error?.message}
              />
            </div>
          )}
        />

        {/* 키 */}
        <Controller
          name='height'
          control={control}
          rules={{
            required: '키를 입력해주세요',
            pattern: {
              value: /^[0-9]+$/,
              message: '숫자만 입력 가능합니다',
            },
            min: { value: 50, message: '50cm 이상 입력해주세요.' },
            max: { value: 250, message: '250cm 이하로 입력해주세요.' },
          }}
          render={({ field, fieldState }) => (
            <div className='flex flex-col gap-[8px]'>
              <label htmlFor='height' className='text-sm font-bold text-gray-500'>
                키 <strong className='text-secondary font-extrabold'>*</strong>
              </label>
              <Input
                {...field}
                id='height'
                type='number'
                noSpinner
                placeholder='0'
                endAdornment='cm'
                status={fieldState.error ? 'error' : 'default'}
                errorMessage={fieldState.error?.message}
              />
            </div>
          )}
        />

        {/* 현재 체중 */}
        <Controller
          name='weight'
          control={control}
          rules={{
            required: '현재 체중을 입력해주세요',
            pattern: {
              value: /^(?:\d{1,3}(?:\.\d)?|)$/,
              message: '소수점 첫째 자리까지 입력 가능합니다',
            },
            min: { value: 20, message: '20kg 이상 입력해주세요.' },
            max: { value: 300, message: '300kg 이하로 입력해주세요.' },
          }}
          render={({ field, fieldState }) => (
            <div className='flex flex-col gap-[8px]'>
              <label htmlFor='weight' className='text-sm font-bold text-gray-500'>
                현재 체중 <strong className='text-secondary font-extrabold'>*</strong>
              </label>
              <Input
                {...field}
                id='weight'
                type='number'
                noSpinner
                step='0.1'
                placeholder='00.0'
                endAdornment='kg'
                status={fieldState.error ? 'error' : 'default'}
                errorMessage={fieldState.error?.message}
              />
            </div>
          )}
        />
      </div>

      <div className='sticky bottom-0 z-30 flex gap-[12px] p-[20px] bg-white'>
        <BasicButton type='button' size='full' variant='line' onClick={onPrev}>
          이전
        </BasicButton>
        <BasicButton type='button' size='full' onClick={handleSubmit(onNext)}>
          다음
        </BasicButton>
      </div>
    </>
  );
}
