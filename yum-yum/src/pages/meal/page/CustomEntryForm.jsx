import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomFoodStore } from '../../../stores/useCustomFoodStore';
import { addCustomFood } from '../../../services/customFoodsApi';

// 컴포넌트
import MealHeader from '../component/MealHeader';
import BasicButton from '@/components/button/BasicButton';
import Input from '@/components/common/Input';
import NutritionSection from '../component/NutritionSection';

// 임시 유저 (나중에 useAuth로 대체)
const mockUser = { uid: 'test-user' };

export default function CustomEntryForm() {
  const navigate = useNavigate();
  const {
    foodName,
    foodSize,
    foodUnit,
    nutrient,
    setField,
    setNutrient,
    reset,
    validate,
    createCustomFood,
  } = useCustomFoodStore();

  // 등록 완료 버튼
  const handleSubmitRegister = async () => {
    if (!validate().ok) return;

    const newFoodData = createCustomFood(mockUser.uid);

    try {
      const newFoodId = await addCustomFood(mockUser.uid, newFoodData);

      reset();
      navigate('/meal');

      console.log(newFoodId);
    } catch (error) {
      alert('등록 실패');
      console.error(error);
    }
    console.log(newFoodData);
  };
  return (
    <div>
      <MealHeader isRight={true}>직접 등록</MealHeader>

      <div className='flex flex-col min-h-[calc(100vh-60px)]'>
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
              value={foodName}
              onChange={(e) => setField('foodName', e.target.value)}
            />
          </div>

          {/* 내용량 */}
          <div className='flex flex-col gap-[8px]'>
            <label className='font-bold' htmlFor='foodSize'>
              내용량<span className='text-xs text-gray-500'>(1회 제공량 기준)</span>{' '}
              <strong className='font-extrabold text-secondary'>*</strong>
            </label>

            <div className='flex gap-2'>
              <Input
                type='number'
                noSpinner
                id='foodSize'
                maxLength={8}
                value={foodSize}
                onChange={(e) => setField('foodSize', e.target.value)}
              />

              <select
                value={foodUnit}
                onChange={(e) => setField('foodUnit', e.target.value)}
                className='w-full max-w-[226px] h-[48px] px-4 border border-[var(--color-gray-300)] rounded-lg transition-colors outline-none'
              >
                <option value='g'>g</option>
                <option value='ml'>ml</option>
              </select>
            </div>
          </div>

          {/* 영양정보 */}
          <NutritionSection value={nutrient} onChange={(key, v) => setNutrient(key, v)} />
        </div>

        <div className='sticky bottom-0 z-30 w-full max-w-[500px] p-[20px] bg-white'>
          <BasicButton size='full' onClick={handleSubmitRegister} disabled={!validate().ok}>
            등록 완료
          </BasicButton>
        </div>
      </div>
    </div>
  );
}
