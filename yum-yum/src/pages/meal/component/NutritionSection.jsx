import React from 'react';
import { toNum } from '@/utils/NutrientNumber';
// 컴포넌트
import Input from '@/components/common/Input';

export default function NutritionSection({ register, errors }) {
  const nutritionFields = [
    { id: 'kcal', label: '칼로리', unit: 'kcal', required: true },
    { id: 'carbs', label: '탄수화물', unit: 'g' },
    { id: 'sugar', label: '- 당', unit: 'g', subtle: true },
    { id: 'sweetener', label: '- 대체 감미료', unit: 'g', subtle: true },
    { id: 'fiber', label: '- 식이섬유', unit: 'g', subtle: true },
    { id: 'protein', label: '단백질', unit: 'g' },
    { id: 'fat', label: '지방', unit: 'g' },
    { id: 'satFat', label: '- 포화지방', unit: 'g', subtle: true },
    { id: 'transFat', label: '- 트랜스지방', unit: 'g', subtle: true },
    { id: 'unsatFat', label: '- 불포화지방', unit: 'g', subtle: true },
    { id: 'cholesterol', label: '콜레스테롤', unit: 'mg' },
    { id: 'sodium', label: '나트륨', unit: 'mg' },
    { id: 'potassium', label: '칼륨', unit: 'mg' },
    { id: 'caffeine', label: '카페인', unit: 'mg' },
  ];

  return (
    <div>
      <label className='font-bold' htmlFor='nutrition'>
        영양정보
      </label>

      <div>
        {nutritionFields.map((f) => (
          <div className='py-[12px]'>
            <div
              key={f.id}
              className={`flex gap-2 items-center  text-sm ${f.subtle ? 'border-none' : 'first:border-t-0 border-t border-gray-200'}`}
            >
              <label
                className={`w-full max-w-[226px] ${f.subtle ? 'pl-[20px] text-gray-500' : ''}`}
                htmlFor={f.id}
              >
                {f.label}{' '}
                {f.required && <strong className='font-extrabold text-secondary'>*</strong>}
              </label>

              <Input
                type='number'
                step='any'
                noSpinner
                id={f.id}
                endAdornment={f.unit}
                placeholder='0'
                min={0}
                max={20000}
                status={errors?.nutrient?.[f.id] ? 'error' : 'default'}
                {...register(`nutrient.${f.id}`, {
                  setValueAs: toNum,
                  ...(f.required && {
                    required: `${f.label}를 입력해주세요.`,
                  }),
                  min: { value: 0, message: '0 이상 입력하세요' },
                  max: { value: 20000, message: '20000 이하로 입력하세요' },
                })}
              />
            </div>

            {f.required && errors?.nutrient?.[f.id] && (
              <p className='text-[var(--color-error)] text-sm mt-1 text-right'>
                {errors.nutrient[f.id].message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
