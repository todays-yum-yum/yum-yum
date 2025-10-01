import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
// 스토어
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 유틸
import { roundTo1, strToNum } from '@/utils/nutrientNumber';
import { calcNutrient } from '@/utils/calcNutrient';
// 컴포넌트
import Modal from '@/components/Modal';

export default function FoodDetailModal({ openModal, closeModal, foodInfo }) {
  if (!foodInfo) return null;

  const { selectedFoods, isFoodSelected, addFood } = useSelectedFoodsStore();
  const baseSize = strToNum(foodInfo.baseFoodSize ?? foodInfo.foodSize); // 기준 내용량
  const isFoodSelect = isFoodSelected(foodInfo.id); // 선택된 음식

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      foodSize: strToNum(foodInfo.baseFoodSize ?? foodInfo.foodSize) || 1,
      quantity: strToNum(foodInfo.foodSize) || 1,
      unit: foodInfo.foodUnit,
    },
    mode: 'onChange',
  });

  const { quantity, unit } = watch();

  // 선택된 음식 수정한 값 유지
  useEffect(() => {
    if (foodInfo) {
      const storedFood = selectedFoods[foodInfo.id];
      if (storedFood) {
        // 수정
        reset({
          foodSize: storedFood.foodSize ?? baseSize,
          quantity: storedFood.quantity ?? (storedFood.unit === '인분' ? 1 : baseSize),
          unit: storedFood.unit ?? foodInfo.foodUnit,
        });
      } else {
        // 신규
        reset({
          foodSize: baseSize,
          quantity: foodInfo.foodUnit === '인분' ? 1 : baseSize,
          unit: foodInfo.foodUnit,
        });
      }
    }
  }, [foodInfo, selectedFoods, reset]);

  const BASIC_UNITS = ['g', 'ml'];
  const getStep = () => (BASIC_UNITS.includes(unit) ? 10 : 0.5);

  // + 버튼
  const handleInc = () => {
    setValue('quantity', Math.max(roundTo1(strToNum(quantity) + getStep()), 0));
  };

  // - 버튼
  const handleDec = () => {
    setValue('quantity', Math.max(roundTo1(strToNum(quantity) - getStep()), 0));
  };

  // 영양소 계산
  const currentNutrients = calcNutrient(
    foodInfo.baseNutrient ?? foodInfo.nutrient,
    baseSize,
    quantity,
    unit,
  );

  // 단위 변경
  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    if (newUnit === '인분') {
      setValue('quantity', 1);
    } else {
      setValue('quantity', baseSize);
    }
    setValue('unit', newUnit);
  };

  // 현재 총 용량 계산
  const totalSize = unit === '인분' ? baseSize * Number(quantity) : Number(quantity);

  // 추가, 수정
  const onSubmit = (data) => {
    const convertedSize =
      data.unit === '인분' ? baseSize * Number(data.quantity) : Number(data.quantity);

    addFood({
      ...foodInfo,
      baseFoodSize: baseSize, // 원본 기준량
      baseNutrient: foodInfo.nutrient,
      foodSize: convertedSize, // 계산된 최종값
      foodUnit: foodInfo.foodUnit, // 원본 단위
      quantity: Number(data.quantity), // 입력한 수량
      unit: data.unit, // 선택한 단위
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
                step={getStep()}
                placeholder='0'
                min={1}
                max={10000}
                {...register('quantity', {
                  required: '용량을 입력해주세요.',
                  min: { value: 1, message: '0 이상 입력해주세요.' },
                  max: { value: 10000, message: '10,000 이하로 입력해주세요.' },
                  pattern: {
                    value: /^\d+(\.\d{1})?$/,
                    message: '소수점은 한 자리까지 입력 가능합니다.',
                  },
                })}
                onBlur={() => {
                  if (quantity != null) {
                    setValue('quantity', roundTo1(strToNum(quantity)));
                  }
                }}
                className='no-spinner w-[120px] outline-none text-center'
              />

              <button onClick={handleInc} className='w-[44px] text-2xl font-extrabold'>
                +
              </button>
            </div>

            <select
              className='w-full h-[48px] px-4 border border-[var(--color-gray-300)] rounded-lg transition-colors outline-none'
              {...register('unit')}
              value={unit}
              onChange={handleUnitChange}
            >
              <option value={foodInfo.foodUnit}>{foodInfo.foodUnit}</option>
              <option value='인분'>인분</option>
            </select>
          </div>

          {errors.quantity && (
            <p className='text-[var(--color-error)] text-sm mt-1 text-left'>
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* 칼로리, 총 용량 */}
        <div>
          <div className='flex items-center justify-between py-[20px] text-sm font-bold'>
            <h3>
              <strong className='text-2xl'>{currentNutrients.kcal}</strong> kcal
            </h3>

            <p className='text-gray-500'>
              총 용량 {quantity}
              {unit}
              {unit === '인분' && ` (${totalSize}${foodInfo.foodUnit})`}
            </p>
          </div>

          {/* 영양소 */}
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
