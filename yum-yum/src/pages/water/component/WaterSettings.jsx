import React from 'react';
// 아이콘
import SettingIcon from '@/assets/icons/icon-setting.svg?react';

export default function WaterSettings({ oneTimeIntake, targetIntake, onOpenModal }) {
  return (
    <div className='flex flex-col gap-[20px] px-[28px] py-[24px] bg-gray-50 rounded-2xl'>
      <div className='flex justify-between'>
        <h5 className='font-bold text-lg'>수분 섭취량</h5>
        <button
          aria-label='수분 섭취량 설정 열기'
          onClick={onOpenModal}
          className='flex items-center justify-center'
        >
          <SettingIcon />
        </button>
      </div>

      <div className='flex flex-col gap-[8px]'>
        <div className='flex justify-between'>
          <p className='text-gray-700'>1회 섭취량</p>
          <p className='font-extrabold'>{oneTimeIntake.toLocaleString()}ml</p>
        </div>
        <div className='flex justify-between'>
          <p className='text-gray-700'>목표 섭취량</p>
          <p className='font-extrabold'>{targetIntake.toLocaleString()}ml</p>
        </div>
      </div>
    </div>
  );
}
