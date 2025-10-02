import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
// 컴포넌트
import Modal from '@/components/Modal';
import Input from '@/components/common/Input';
// 아이콘
import LightIcon from '@/assets/icons/icon-light-bulb.svg?react';

export default function WaterIntakeModal({
  isOpenModal,
  onCloseModal,
  onBtnClick,
  oneTimeIntake,
  targetIntake,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oneTimeIntake,
      targetIntake,
    },
    mode: 'onBlur',
  });

  // 모달 열릴때 초기화
  useEffect(() => {
    if (isOpenModal) {
      reset({ oneTimeIntake, targetIntake });
    }
  }, [isOpenModal, oneTimeIntake, targetIntake, reset]);

  // 확인 버튼
  const onConfirm = (data) => {
    onBtnClick(data);
  };

  return (
    <Modal
      isOpenModal={isOpenModal}
      onCloseModal={onCloseModal}
      title='수분 섭취량 설정'
      btnLabel='확인'
      showClose={true}
      onBtnClick={handleSubmit(onConfirm)}
    >
      <div className='flex flex-col gap-[28px]'>
        <div className='flex flex-col gap-[20px]'>
          {/* 1회 섭취량 */}
          <div>
            <div className='flex items-center justify-between'>
              <label htmlFor='oneTimeIntake' className='w-full font-bold'>
                1회 섭취량
              </label>
              <Input
                id='oneTimeIntake'
                type='number'
                noSpinner
                endAdornment='ml'
                placeholder='50 ~ 1,000'
                min={50}
                max={1000}
                status={errors.oneTimeIntake ? 'error' : 'default'}
                {...register('oneTimeIntake', {
                  required: '1회 섭취량을 입력해주세요',
                  min: { value: 50, message: '50ml 이상 입력해주세요.' },
                  max: { value: 1000, message: '1,000ml 이하로 입력해주세요.' },
                })}
              />
            </div>
            {errors.oneTimeIntake && (
              <p className='text-[var(--color-error)] text-sm mt-1 text-right'>
                {errors.oneTimeIntake.message}
              </p>
            )}
          </div>

          {/* 목표 섭취량 */}
          <div>
            <div className='flex items-center justify-between'>
              <label htmlFor='targetIntake' className='w-full font-bold'>
                목표 섭취량
              </label>
              <Input
                id='targetIntake'
                type='number'
                noSpinner
                endAdornment='ml'
                placeholder='500 ~ 10,000'
                min={500}
                max={10000}
                status={errors.targetIntake ? 'error' : 'default'}
                {...register('targetIntake', {
                  required: '목표 섭취량을 입력해주세요',
                  min: { value: 500, message: '500ml 이상 입력해주세요.' },
                  max: { value: 10000, message: '10,000ml 이하로 입력해주세요.' },
                })}
              />
            </div>
            {errors.targetIntake && (
              <p className='text-[var(--color-error)] text-sm mt-1 text-right'>
                {errors.targetIntake.message}
              </p>
            )}
          </div>
        </div>

        {/* 수분 섭취 참고 */}
        <div className='flex flex-col gap-[8px] p-[20px] bg-gray-50 rounded-2xl'>
          <div className='flex gap-[4px]'>
            <div className='flex items-center justify-center'>
              <LightIcon />
            </div>
            <p className='text-gray-600 font-extrabold'>수분 섭취 참고</p>
          </div>

          <div className='text-sm text-gray-500'>
            <p>
              성인 남성은 하루 약 2,500ml, 성인 여성은 약 2,000ml의 수분 섭취가 권장돼요. (음식 속
              수분까지 포함된 양이기 때문에 실제로 마시는 물은 조금 적어도 됩니다.)
            </p>
            <p>물은 한 번에 많이 마시는 것보다 조금씩 자주 마시는 습관이 더 좋아요!</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
