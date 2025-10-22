import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// 훅
import { useCustomFoods } from '@/hooks/useCustomFoods';
// 유틸
import { toNum } from '@/utils/nutrientNumber';
import { callUserUid } from '@/utils/localStorage';
// 컴포넌트
import MealHeader from '../component/MealHeader';
import BasicButton from '@/components/button/BasicButton';
import Input from '@/components/common/Input';
import NutritionSection from '../component/NutritionSection';

export default function CustomEntryForm() {
  const userId = callUserUid(); // 로그인한 유저 uid 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.date || new Date();
  const type = location.state?.type;
  const { addFoodMutation } = useCustomFoods(userId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      foodName: '',
      servingSize: '',
      servingUnit: 'g',
      nutrient: {
        kcal: null,
        carbs: null,
        sugar: null,
        sweetener: null,
        fiber: null,
        protein: null,
        fat: null,
        satFat: null,
        transFat: null,
        unsatFat: null,
        cholesterol: null,
        sodium: null,
        potassium: null,
        caffeine: null,
      },
    },
    mode: 'all',
  });

  const onSubmit = async (data) => {
    try {
      await addFoodMutation.mutateAsync(data);
      reset();
      navigate(`/meal/${type}`, { state: { date: selectedDate, type: type } });
    } catch (error) {
      console.error('직접 등록 실패', error);
    }
  };

  return (
    <div>
      <MealHeader isRight={true}>직접 등록</MealHeader>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col min-h-[calc(100vh-60px)]'>
        <div className='flex-1 flex flex-col gap-[24px] px-[20px]'>
          {/* 음식명 */}
          <div className='flex flex-col gap-[8px]'>
            <label className='font-bold' htmlFor='foodName'>
              음식명 <strong className='font-extrabold text-secondary'>*</strong>
            </label>
            <Input
              id='foodName'
              placeholder='음식명 (최대 20자)'
              maxLength={20}
              status={errors.foodName ? 'error' : 'default'}
              {...register('foodName', {
                required: '음식명을 입력해주세요.',
                maxLength: { value: 20, message: '최대 20자까지 입력 가능합니다.' },
              })}
            />
            {errors.foodName && (
              <p className='text-[var(--color-error)] text-sm'>{errors.foodName.message}</p>
            )}
          </div>

          {/* 내용량 */}
          <div className='flex flex-col gap-[8px]'>
            <label className='font-bold' htmlFor='servingSize'>
              내용량<span className='text-xs text-gray-500'>(1회 제공량 기준)</span>{' '}
              <strong className='font-extrabold text-secondary'>*</strong>
            </label>

            <div className='flex gap-2'>
              <Input
                id='servingSize'
                type='number'
                step='0.1'
                noSpinner
                status={errors.servingSize ? 'error' : 'default'}
                {...register('servingSize', {
                  setValueAs: toNum,
                  required: '내용량을 입력해주세요.',
                  min: { value: 1, message: '0 이상 입력해주세요' },
                  max: { value: 10000, message: '10,000 이하로 입력해주세요' },
                  validate: (v) =>
                    v == null ||
                    /^\d+(\.\d{1})?$/.test(String(v)) ||
                    '소수점은 한 자리까지 입력 가능합니다.',
                })}
              />

              <select
                {...register('servingUnit')}
                aria-label='단위 선택'
                className='w-full max-w-[226px] h-[48px] px-4 border border-[var(--color-gray-300)] rounded-lg transition-colors outline-none'
              >
                <option value='g'>g</option>
                <option value='ml'>ml</option>
              </select>
            </div>
            {errors.servingSize && (
              <p className='text-[var(--color-error)] text-sm'>{errors.servingSize.message}</p>
            )}
          </div>

          {/* 영양정보 */}
          <NutritionSection register={register} errors={errors} />
        </div>

        <div className='sticky bottom-0 z-30 w-full max-w-[500px] p-[20px] bg-white'>
          <BasicButton aria-label='등록 완료' size='full' type='submit'>
            등록 완료
          </BasicButton>
        </div>
      </form>
    </div>
  );
}
