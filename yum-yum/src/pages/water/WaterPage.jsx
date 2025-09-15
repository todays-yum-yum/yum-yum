import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useWaterStore } from '@/stores/useWaterStore.js';
import { toNum } from '@/utils/WaterNumber';
import {
  addWaterIntake,
  getWaterIntake,
  getWaterSettings,
  saveWaterSettings,
} from '@/services/waterApi.js';
// 컴포넌트
import BasicButton from '@/components/button/BasicButton';
import WaterIntakeModal from './component/WaterIntakeModal';
// 아이콘
import DropIcon from '@/assets/icons/icon-drop.svg?react';
import PlusIcon from '@/assets/icons/icon-plus.svg?react';
import MinusIcon from '@/assets/icons/icon-minus.svg?react';
import SettingIcon from '@/assets/icons/icon-setting.svg?react';

export default function WaterPage({ defaultDate = new Date() }) {
  const {
    waterAmount,
    setWaterAmount,
    oneTimeIntake,
    setOneTimeIntake,
    targetIntake,
    setTargetIntake,
  } = useWaterStore();

  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const selectedDate = location.state?.date || defaultDate;
  const waterStep = oneTimeIntake; // 1회 섭취량 기준

  // 수분 기록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedSaveDate = format(selectedDate, 'yyyy-MM-dd');
        const data = await getWaterIntake('test-user', formattedSaveDate);
        if (data) {
          setWaterAmount(data.dailyTotal);
        } else {
          setWaterAmount(0);
        }
      } catch (error) {
        console.error('불러오기 실패:', error);
        throw error;
      }
    };
    fetchData();
  }, [selectedDate, setWaterAmount]);

  // 수분 섭취량 설정 불러오기
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getWaterSettings('test-user');
        setOneTimeIntake(settings.oneTimeIntake);
        setTargetIntake(settings.targetIntake);
      } catch (error) {
        console.error('불러오기 실패:', error);
        throw error;
      }
    };

    fetchSettings();
  }, ['test-user', setOneTimeIntake, setTargetIntake]);

  // + 버튼
  const handleInc = () => {
    setWaterAmount(Math.max(waterAmount + waterStep, 0));
  };

  // - 버튼
  const handleDec = () => {
    setWaterAmount(Math.max(waterAmount - waterStep, 0));
  };

  // 수분 섭취량 설정 버튼
  const handleWaterIntakeModify = async () => {
    try {
      await saveWaterSettings('test-user', oneTimeIntake, targetIntake);

      setOneTimeIntake(oneTimeIntake);
      setTargetIntake(targetIntake);

      toast.success('설정 저장 완료!');
      setOpenModal(false);
    } catch (error) {
      toast.error('수분 섭취량 설정 실패');
      console.error(error);
    }
  };

  // 기록하기 버튼
  const handleRecord = async () => {
    try {
      const formattedSaveDate = format(selectedDate, 'yyyy-MM-dd');
      await addWaterIntake('test-user', formattedSaveDate, waterAmount);
      // await addWaterIntake(user.uid, formattedSaveDate, waterAmount);
      if (waterAmount >= targetIntake) {
        toast.success('오늘 목표 달성! 대단해요! 🎉');
      } else {
        toast.success('물 한 잔 추가 💧 좋은 습관이에요 👍');
      }

      navigate('/');
    } catch (error) {
      toast.error('수분 기록 실패');
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col justify-between  min-h-[calc(100vh-60px)] p-[20px]'>
      {/* 타이틀 */}
      <div className='flex flex-col gap-[12px] pt-[20px] pl-[20px]'>
        <h4 className='text-3xl'>지금 필요한 건</h4>

        <div className='flex gap-[4px]'>
          <h3 className='text-4xl font-extrabold'>물 한 잔!</h3>
          <div className='flex items-center justify-center'>
            <DropIcon className='w-[40px] h-[40px]' />
          </div>
        </div>
      </div>

      {/* 수분 기록 */}
      <div className='flex items-center w-full justify-around'>
        <button onClick={handleDec} className='flex items-center justify-center'>
          <MinusIcon className='text-primary w-[40px] h-[40px]' />
        </button>

        <div className='flex items-end justify-center'>
          <input
            type='number'
            value={toNum(waterAmount)}
            min={1}
            max={10000}
            onChange={(e) => setWaterAmount(toNum(e.target.value))}
            className='no-spinner [field-sizing:content] text-4xl font-extrabold text-right outline-none'
            // [field-sizing:content]: 인풋 글자수에 따라 width늘어남 테일윈드에서는 없어서 []로 적용
          />

          <p className='text-lg'>ml</p>
        </div>

        <button onClick={handleInc} className='flex items-center justify-center'>
          <PlusIcon className='text-primary w-[40px] h-[40px]' />
        </button>
      </div>

      <div className='flex flex-col gap-[40px]'>
        {/* 수분 섭취량 */}
        <div className='flex flex-col gap-[20px] px-[28px] py-[24px] bg-gray-50 rounded-2xl'>
          <div className='flex justify-between'>
            <h5 className='font-bold text-lg'>수분 섭취량</h5>
            <button onClick={() => setOpenModal(true)} className='flex items-center justify-center'>
              <SettingIcon />
            </button>
          </div>

          <div className='flex flex-col gap-[8px]'>
            <div className='flex justify-between'>
              <p className='text-gray-700'>1회 섭취량</p>
              <p className='font-extrabold'>{oneTimeIntake}ml</p>
            </div>
            <div className='flex justify-between'>
              <p className='text-gray-700'>목표 섭취량</p>
              <p className='font-extrabold'>{targetIntake}ml</p>
            </div>
          </div>
        </div>

        <BasicButton size='full' onClick={handleRecord}>
          기록하기
        </BasicButton>
      </div>

      <WaterIntakeModal
        isOpenModal={openModal}
        onCloseModal={() => setOpenModal(false)}
        onBtnClick={handleWaterIntakeModify}
        oneTimeIntake={oneTimeIntake}
        setOneTimeIntake={setOneTimeIntake}
        targetIntake={targetIntake}
        setTargetIntake={setTargetIntake}
      />
    </div>
  );
}
