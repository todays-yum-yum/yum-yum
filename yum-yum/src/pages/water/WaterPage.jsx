import React, { useState } from 'react';
// 컴포넌트
import BasicButton from '@/components/button/BasicButton';
import WaterIntakeModal from './component/WaterIntakeModal.jsx';
// 아이콘
import DropIcon from '@/assets/icons/icon-drop.svg?react';
import PlusIcon from '@/assets/icons/icon-plus.svg?react';
import MinusIcon from '@/assets/icons/icon-minus.svg?react';
import SettingIcon from '@/assets/icons/icon-setting.svg?react';

export default function WaterPage() {
  const [waterAmount, setWaterAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleWaterIntakeModify = () => {
    setOpenModal(false);
  };

  return (
    <div className='flex flex-col justify-between  min-h-[calc(100vh-60px)] p-[20px]'>
      {/* 타이틀 */}
      <div className='flex flex-col gap-[4px] pt-[20px] pl-[20px]'>
        <h4 className='text-2xl'>지금 필요한 건</h4>

        <div className='flex gap-[4px]'>
          <h3 className='text-3xl font-extrabold'>물 한 잔!</h3>
          <div className='flex items-center justify-center'>
            <DropIcon />
          </div>
        </div>
      </div>

      {/* 수분 기록 */}
      <div className='flex items-center w-full justify-around'>
        <button className='flex items-center justify-center'>
          <MinusIcon className='text-primary w-[40px] h-[40px]' />
        </button>

        <div className='flex items-end justify-center'>
          <input
            type='number'
            value={waterAmount}
            min={1}
            max={10000}
            onChange={(e) => setWaterAmount(Number(e.target.value))}
            className='[field-sizing:content] text-4xl font-extrabold text-right'
            // [field-sizing:content]: 인풋 글자수에 따라 width늘어남 테일윈드에서는 없어서 []로 적용
          />

          <p className='text-lg'>ml</p>
        </div>

        <button className='flex items-center justify-center'>
          <PlusIcon className='text-primary w-[40px] h-[40px]' />
        </button>
      </div>

      <div className='flex flex-col gap-[40px]'>
        {/* 수분 섭취량 */}
        <div className='flex flex-col gap-[20px] px-[28px] py-[24px] bg-gray-50 rounded-2xl'>
          <div className='flex justify-between'>
            <h5 className='font-bold text-lg'>수분 섭취량</h5>
            <div
              onClick={() => setOpenModal(true)}
              className='flex items-center justify-center cursor-pointer'
            >
              <SettingIcon />
            </div>
          </div>

          <div className='flex flex-col gap-[8px]'>
            <div className='flex justify-between'>
              <p className='text-gray-700'>1회 섭취량</p>
              <p className='font-extrabold'>200ml</p>
            </div>
            <div className='flex justify-between'>
              <p className='text-gray-700'>목표 섭취량</p>
              <p className='font-extrabold'>1500ml</p>
            </div>
          </div>
        </div>

        <BasicButton size='full'>기록 하기</BasicButton>
      </div>

      <WaterIntakeModal
        isOpenModal={openModal}
        onCloseModal={() => setOpenModal(false)}
        onBtnClick={handleWaterIntakeModify}
      />
    </div>
  );
}
