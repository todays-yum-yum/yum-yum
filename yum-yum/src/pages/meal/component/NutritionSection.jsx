import React, { useState } from 'react';
import Input from '../../../components/common/Input';

export default function NutritionSection() {
  const [values, setValues] = useState({
    kcal: '',
    carbs: '',
    sugar: '',
    sweetener: '',
    fiber: '',
    protein: '',
    fat: '',
    satFat: '',
    transFat: '',
    unsatFat: '',
    cholesterol: '',
    sodium: '',
    potassium: '',
    caffeine: '',
  });

  const set = (id) => (e) => setValues((prev) => ({ ...prev, [id]: e.target.value }));

  const nutritionFields = [
    { type: 'row', label: '칼로리', id: 'kcal', unit: 'kcal', required: true },

    { type: 'row', label: '탄수화물', id: 'carbs', unit: 'g' },
    { type: 'row', label: '- 당', id: 'sugar', unit: 'g', subtle: true },
    { type: 'row', label: '- 대체 감미료', id: 'sweetener', unit: 'g', subtle: true },
    { type: 'row', label: '- 식이섬유', id: 'fiber', unit: 'g', subtle: true },

    { type: 'row', label: '단백질', id: 'protein', unit: 'g' },

    { type: 'row', label: '지방', id: 'fat', unit: 'g' },
    { type: 'row', label: '- 포화지방', id: 'satFat', unit: 'g', subtle: true },
    { type: 'row', label: '- 트랜스지방', id: 'transFat', unit: 'g', subtle: true },
    { type: 'row', label: '- 불포화지방', id: 'unsatFat', unit: 'g', subtle: true },

    { type: 'row', label: '콜레스테롤', id: 'cholesterol', unit: 'mg' },
    { type: 'row', label: '나트륨', id: 'sodium', unit: 'mg' },
    { type: 'row', label: '칼륨', id: 'potassium', unit: 'mg' },
    { type: 'row', label: '카페인', id: 'caffeine', unit: 'mg' },
  ];

  return (
    <div>
      <label className='font-bold' htmlFor='nutrition'>
        영양정보
      </label>

      <div>
        {nutritionFields.map((f) => (
          <div
            key={f.id}
            className={`flex gap-2 items-center py-[12px] text-sm first:border-t-0 border-t border-gray-300 ${f.subtle ? 'border-none' : ''}`}
          >
            <label
              className={`w-full max-w-[226px] ${f.subtle ? 'pl-[20px] text-gray-500' : ''}`}
              htmlFor={f.id}
            >
              {f.label} {f.required && <strong className='font-extrabold text-secondary'>*</strong>}
            </label>
            <Input
              id={f.id}
              value={values[f.id]}
              onChange={set(f.id)}
              endAdornment={f.unit}
              placeholder='0'
              maxLength={8}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
