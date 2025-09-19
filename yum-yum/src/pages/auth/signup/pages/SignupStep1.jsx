import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// 컴포넌트
import BasicButton from '@/components/button/BasicButton';
import Input from '@/components/common/Input';
import AgreementsSection from '../components/AgreementsSection';

export default function SignupStep1({ onNext }) {
  const { control, handleSubmit, watch } = useFormContext();
  const pw = watch('pw');

  // 성별
  const genderOption = [
    { value: 'female', label: '여성' },
    { value: 'male', label: '남성' },
  ];

  return (
    <>
      <div className='flex flex-col gap-[20px] px-[20px]'>
        {/* 이름 */}
        <Controller
          name='name'
          control={control}
          rules={{
            required: '이름을 입력해주세요',
            minLength: { value: 2, message: '2자 이상 입력해주세요.' },
            maxLength: { value: 5, message: '5자 이하로 입력해주세요.' },
            pattern: { value: /^[가-힣]+$/, message: '한글만 입력 가능해요.' },
          }}
          render={({ field, fieldState }) => (
            <div className='flex flex-col gap-[8px]'>
              <label htmlFor='name' className='text-sm font-bold text-gray-500'>
                이름 <strong className='text-secondary font-extrabold'>*</strong>
              </label>
              <Input
                {...field}
                id='name'
                placeholder='이름'
                status={fieldState.error ? 'error' : 'default'}
                errorMessage={fieldState.error?.message}
                maxLength='5'
              />
            </div>
          )}
        />

        {/* 이메일 */}
        <Controller
          name='email'
          control={control}
          rules={{
            required: '이메일을 입력해주세요',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '올바른 이메일 형식이 아니에요.',
            },
            // 이메일 중복확인 추가
          }}
          render={({ field, fieldState }) => (
            <div className='flex flex-col gap-[8px]'>
              <label htmlFor='email' className='text-sm font-bold text-gray-500'>
                이메일 <strong className='text-secondary font-extrabold'>*</strong>
              </label>
              <div className='flex gap-[12px]'>
                <Input
                  {...field}
                  id='email'
                  placeholder='yumyum@gmail.com'
                  status={fieldState.error ? 'error' : 'default'}
                  errorMessage={fieldState.error?.message}
                  className='flex-1'
                />
                <BasicButton
                  type='button'
                  size='2xl'
                  onClick={() => console.log('중복 확인:', field.value)}
                >
                  중복확인
                </BasicButton>
              </div>
            </div>
          )}
        />

        {/* 비밀번호 */}
        <Controller
          name='pw'
          control={control}
          rules={{
            required: '비밀번호를 입력해주세요',
            minLength: { value: 8, message: '8자 이상 입력해주세요.' },
            maxLength: { value: 20, message: '20자 이하로 입력해주세요.' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/,
              message: '영문, 숫자, 특수문자를 모두 포함해야 해요.',
            },
          }}
          render={({ field, fieldState }) => (
            <div className='flex flex-col gap-[8px]'>
              <label htmlFor='pw' className='text-sm font-bold text-gray-500'>
                비밀번호 <strong className='text-secondary font-extrabold'>*</strong>
              </label>
              <Input
                {...field}
                id='pw'
                type='password'
                placeholder='영문, 숫자, 특수문자 포함 8~20자'
                status={fieldState.error ? 'error' : 'default'}
                errorMessage={fieldState.error?.message}
                maxLength='20'
              />
            </div>
          )}
        />

        {/* 비밀번호 확인 */}
        <Controller
          name='pwCheck'
          control={control}
          rules={{
            required: '비밀번호 확인을 입력해주세요',
            validate: (value) => value === pw || '비밀번호가 일치하지 않아요.',
          }}
          render={({ field, fieldState }) => (
            <div className='flex flex-col gap-[8px]'>
              <label htmlFor='pwCheck' className='text-sm font-bold text-gray-500'>
                비밀번호 확인 <strong className='text-secondary font-extrabold'>*</strong>
              </label>
              <Input
                {...field}
                id='pwCheck'
                type='password'
                placeholder='영문, 숫자, 특수문자 포함 8~20자'
                status={fieldState.error ? 'error' : 'default'}
                errorMessage={fieldState.error?.message}
                maxLength='20'
              />
            </div>
          )}
        />

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

      {/* 약관 동의 */}
      <AgreementsSection />

      <div className='p-[20px] bg-white'>
        <BasicButton size='full' onClick={handleSubmit(onNext)}>
          다음
        </BasicButton>
      </div>
    </>
  );
}
