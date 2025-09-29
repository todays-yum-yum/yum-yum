import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
// 스토어
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 유틸
import { roundTo1, strToNum } from '@/utils/nutrientNumber';
// 컴포넌트
import Modal from '@/components/Modal';

export default function FoodDetailModal({ openModal, closeModal, foodInfo }) {
  if (!foodInfo) return null;

  const { selectedFoods, isFoodSelected, addFood } = useSelectedFoodsStore();
  const baseSize = strToNum(foodInfo.foodSize); // 기준 내용량
  const n = foodInfo?.nutrient; // 영양소
  const isFoodSelect = isFoodSelected(foodInfo.id); // 선택된 음식
  const FOOD_STEP = 10; // 증가, 감소 단위

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      foodSize: baseSize || '',
    },
    mode: 'onChange',
  });

  const foodSize = watch('foodSize');

  // 선택된 음식 수정한 값 유지
  useEffect(() => {
    if (foodInfo) {
      const storedFood = selectedFoods[foodInfo.id];
      reset({
        foodSize: storedFood ? storedFood.foodSize : strToNum(foodInfo.foodSize),
      });
    }
  }, [foodInfo, selectedFoods, reset]);

  // + 버튼
  const handleInc = () => {
    setValue('foodSize', Math.max(roundTo1(strToNum(foodSize) + FOOD_STEP), 0));
  };

  // - 버튼
  const handleDec = () => {
    setValue('foodSize', Math.max(roundTo1(strToNum(foodSize) - FOOD_STEP), 0));
  };

  // 현재 내용량 / 기준 내용량
  const ratio = useMemo(() => (baseSize > 0 ? foodSize / baseSize : 0), [foodSize, baseSize]);

  // 영양소 계산
  const currentNutrients = useMemo(() => {
    const scale = (v) => (v == null ? null : roundTo1(strToNum(v) * ratio));
    return {
      kcal: n.kcal == null ? null : Math.round(strToNum(n.kcal) * ratio),
      carbs: scale(n.carbs),
      sugar: scale(n.sugar),
      sweetener: scale(n.sweetener),
      fiber: scale(n.fiber),
      protein: scale(n.protein),
      fat: scale(n.fat),
      satFat: scale(n.satFat),
      transFat: scale(n.transFat),
      unsatFat: scale(n.unsatFat),
      cholesterol: scale(n.cholesterol),
      sodium: scale(n.sodium),
      potassium: scale(n.potassium),
      caffeine: scale(n.caffeine),
    };
  }, [n, ratio]);

  // 추가, 수정
  const onSubmit = (data) => {
    addFood({
      ...foodInfo,
      foodSize: Number(data.foodSize),
      nutrient: currentNutrients,
    });
    closeModal();
    toast.success(isFoodSelect ? '수정 되었습니다' : '추가 되었습니다');
  };

  // 영양소 필드
  const nutritionFields = [
    { id: 'carbs', label: '탄수화물', value: currentNutrients.carbs, unit: 'g' },
    { id: 'sugar', label: '- 당', value: currentNutrients.sugar, unit: 'g', subtle: true },
    {
      id: 'sweetener',
      label: '- 대체 감미료',
      value: currentNutrients.sweetener,
      unit: 'g',
      subtle: true,
    },
    { id: 'fiber', label: '- 식이섬유', value: currentNutrients.fiber, unit: 'g', subtle: true },
    { id: 'protein', label: '단백질', value: currentNutrients.protein, unit: 'g' },
    { id: 'fat', label: '지방', value: currentNutrients.fat, unit: 'g' },
    { id: 'satFat', label: '- 포화지방', value: currentNutrients.satFat, unit: 'g', subtle: true },
    {
      id: 'transFat',
      label: '- 트랜스지방',
      value: currentNutrients.transFat,
      unit: 'g',
      subtle: true,
    },
    {
      id: 'unsatFat',
      label: '- 불포화지방',
      value: currentNutrients.unsatFat,
      unit: 'g',
      subtle: true,
    },
    { id: 'cholesterol', label: '콜레스테롤', value: currentNutrients.cholesterol, unit: 'mg' },
    { id: 'sodium', label: '나트륨', value: currentNutrients.sodium, unit: 'mg' },
    { id: 'potassium', label: '칼륨', value: currentNutrients.potassium, unit: 'mg' },
    { id: 'caffeine', label: '카페인', value: currentNutrients.caffeine, unit: 'mg' },
  ];

  return (
    <Modal
      isOpenModal={openModal}
      onCloseModal={closeModal}
      title={foodInfo?.foodName}
      btnLabel={isFoodSelect ? '수정하기' : '추가하기'}
      onBtnClick={handleSubmit(onSubmit)}
      showClose={true}
    >
      <div className='flex flex-col gap-[20px] max-h-[calc(100vh-300px)] overflow-y-auto'>
        <div>
          <div className='flex gap-[8px]'>
            <div className='flex items-center justify-between min-w-[226px] h-[48px] border border-[var(--color-gray-300)] rounded-lg'>
              <button onClick={handleDec} className='w-[44px] text-2xl font-extrabold'>
                -
              </button>

              <input
                type='number'
                step={FOOD_STEP}
                placeholder='0'
                min={1}
                max={10000}
                {...register('foodSize', {
                  required: '용량을 입력해주세요.',
                  min: { value: 1, message: '0 이상 입력해주세요.' },
                  max: { value: 10000, message: '10,000 이하로 입력해주세요.' },
                  pattern: {
                    value: /^\d+(\.\d{1})?$/,
                    message: '소수점은 한 자리까지 입력 가능합니다.',
                  },
                })}
                onBlur={() => {
                  if (foodSize != null) {
                    setValue('foodSize', roundTo1(strToNum(foodSize)));
                  }
                }}
                className='no-spinner w-[120px] outline-none text-center'
              />

              <button onClick={handleInc} className='w-[44px] text-2xl font-extrabold'>
                +
              </button>
            </div>

            <select className='w-full h-[48px] px-4 border border-[var(--color-gray-300)] rounded-lg transition-colors outline-none'>
              <option value={foodInfo.foodUnit}>{foodInfo.foodUnit}</option>
            </select>
          </div>

          {errors.foodSize && (
            <p className='text-[var(--color-error)] text-sm mt-1 text-left'>
              {errors.foodSize.message}
            </p>
          )}
        </div>

        <div>
          <div className='flex items-center justify-between py-[20px] text-sm font-bold'>
            <h3>
              <strong className='text-2xl'>{currentNutrients.kcal}</strong> kcal
            </h3>
            <p className='text-gray-500'>
              총 용량 {foodSize}
              {foodInfo.foodUnit}
            </p>
          </div>

          {/* 값이 없으면 리스트 숨김 */}
          {nutritionFields
            .filter((f) => f.value !== null && f.value !== undefined && f.value !== '')
            .map((f) => (
              <div
                key={f.id}
                className={`flex justify-between items-center py-[16px] text-sm ${f.subtle ? 'border-none text-gray-500' : 'border-t border-gray-200'}`}
              >
                <h5 className={`${f.subtle ? 'pl-[20px]' : ''}`}>{f.label}</h5>
                <p className='font-bold'>
                  {f.value}
                  {f.unit}
                </p>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
}
