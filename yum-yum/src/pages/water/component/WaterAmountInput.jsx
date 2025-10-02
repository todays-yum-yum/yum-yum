import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
// 유틸
import { toNum } from '@/utils/waterNumber';
// 아이콘
import PlusIcon from '@/assets/icons/icon-plus.svg?react';
import MinusIcon from '@/assets/icons/icon-minus.svg?react';

export default function WaterAmountInput({ control, waterStep }) {
  return (
    <Controller
      name='waterAmount'
      control={control}
      rules={{
        required: { message: '수분 섭취량을 입력해주세요.' },
        min: { value: 0, message: '0ml 이상 입력해주세요.' },
        max: { value: 10000, message: '최대 10,000ml까지만 기록할 수 있어요!' },
      }}
      render={({ field: { value, onChange }, fieldState }) => {
        useEffect(() => {
          if (fieldState.error) {
            toast.dismiss(); // 중복 토스트 방지
            toast.error(fieldState.error.message);
          }
        }, [fieldState.error]);

        // + 버튼
        const handleInc = () => {
          if (value + waterStep > 10000) {
            toast.error('최대 10,000ml까지만 기록할 수 있어요!');
            onChange(10000);
          } else {
            onChange(value + waterStep);
          }
        };

        // - 버튼
        const handleDec = () => {
          onChange(Math.max(value - waterStep, 0));
        };

        // 직접 입력
        const handleWaterAmountChange = (e) => {
          let str = e.target.value;

          // 숫자 이외 입력 막기
          if (/[^0-9]/.test(str)) {
            toast.dismiss();
            toast.error('숫자만 입력할 수 있어요!');
            str = str.replace(/[^0-9]/g, '');
          }

          // 글자 수 제한
          if (str.length > 5) {
            str = str.slice(0, 5);
          }

          let v = toNum(str);
          onChange(v);
        };

        return (
          <div className='flex items-center w-full justify-around'>
            <button type='button' onClick={handleDec} className='flex items-center justify-center'>
              <MinusIcon className='text-primary w-[40px] h-[40px]' />
            </button>

            <div className='flex items-end justify-center'>
              <input
                type='text'
                inputMode='numeric' // 모바일에서 숫자 키패드
                maxLength={5}
                placeholder='0'
                value={value}
                onChange={handleWaterAmountChange}
                className='no-spinner [field-sizing:content] text-4xl font-extrabold text-right outline-none'
                // [field-sizing:content]: 인풋 글자수에 따라 width늘어남 테일윈드에서는 없어서 []로 적용
              />

              <p className='text-lg'>ml</p>
            </div>

            <button type='button' onClick={handleInc} className='flex items-center justify-center'>
              <PlusIcon className='text-primary w-[40px] h-[40px]' />
            </button>
          </div>
        );
      }}
    />
  );
}
