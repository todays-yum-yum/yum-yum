import React from 'react';
import { toNum } from '@/utils/WaterNumber';
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
  setOneTimeIntake,
  targetIntake,
  setTargetIntake,
}) {
  const intakeSetting = [
    {
      label: '1회 섭취량',
      value: oneTimeIntake,
      onchange: (e) => setOneTimeIntake(toNum(e.target.value)),
    },
    {
      label: '목표 섭취량',
      value: targetIntake,
      onchange: (e) => setTargetIntake(toNum(e.target.value)),
    },
  ];
  return (
    <Modal
      isOpenModal={isOpenModal}
      onCloseModal={onCloseModal}
      title='수분 섭취량 설정'
      btnLabel='확인'
      onBtnClick={onBtnClick}
      showClose={true}
    >
      <div className='flex flex-col gap-[28px]'>
        <div className='flex flex-col gap-[20px]'>
          {intakeSetting.map((item) => (
            <div key={item.label} className='flex items-center justify-between'>
              <span className='w-full font-bold'>{item.label}</span>
              <Input
                type='number'
                value={item.value}
                endAdornment='ml'
                placeholder='0'
                min={0}
                max={20000}
                noSpinner
                onChange={item.onchange}
              />
            </div>
          ))}
        </div>

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
