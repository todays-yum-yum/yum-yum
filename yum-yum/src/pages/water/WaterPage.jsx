import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
// 훅
import { useWaterIntake } from '@/hooks/useWater';
// 유틸
import { toNum } from '@/utils/waterNumber';
import { callUserUid } from '@/utils/localStorage';
// 컴포넌트
import BasicButton from '@/components/button/BasicButton';
import WaterIntakeModal from './component/WaterIntakeModal';
import WaterSettings from './component/WaterSettings';
import WaterAmountInput from './component/WaterAmountInput';
// 아이콘
import DropIcon from '@/assets/icons/icon-drop.svg?react';

export default function WaterPage({ defaultDate = new Date() }) {
  const userId = callUserUid(); // 로그인한 유저 uid 가져오기
  const navigate = useNavigate();
  const location = useLocation();

  // 날짜 관련
  const selectedDate = useMemo(
    () => location.state?.date || defaultDate,
    [location.state, defaultDate],
  );
  const formattedSaveDate = format(selectedDate, 'yyyy-MM-dd');

  // 쿼리
  const { waterData, waterSettings, addWaterIntakeMutation, saveWaterSettingsMutation } =
    useWaterIntake(userId, selectedDate);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      waterAmount: 0,
      oneTimeIntake: 500,
      targetIntake: 2000,
    },
    mode: 'onChange',
  });

  // 쿼리 데이터 들어오면 form에 반영
  useEffect(() => {
    if (waterData || waterSettings) {
      reset({
        waterAmount: waterData?.dailyTotal ?? 0,
        oneTimeIntake: waterSettings?.oneTimeIntake ?? 500,
        targetIntake: waterSettings?.targetIntake ?? 2000,
      });
    }
  }, [waterData, waterSettings, reset]);

  const oneTimeIntake = toNum(watch('oneTimeIntake'));
  const targetIntake = toNum(watch('targetIntake'));
  const waterAmount = toNum(watch('waterAmount'));
  const waterStep = oneTimeIntake;

  const [openModal, setOpenModal] = useState(false);

  // 수분 섭취량 설정 저장
  const saveWaterIntakeSettings = async (data) => {
    try {
      // 기존값
      const current = {
        oneTimeIntake: waterSettings?.oneTimeIntake ?? 500,
        targetIntake: waterSettings?.targetIntake ?? 2000,
      };

      // 수정한 값
      const newSettings = {
        oneTimeIntake: toNum(data.oneTimeIntake),
        targetIntake: toNum(data.targetIntake),
      };

      // 값이 같으면 api 호출 막기
      if (
        current.oneTimeIntake === newSettings.oneTimeIntake &&
        current.targetIntake === newSettings.targetIntake
      ) {
        toast.success('설정 저장 완료!');
        setOpenModal(false);
        return;
      }

      await saveWaterSettingsMutation.mutateAsync(data);
      setOpenModal(false);
    } catch (error) {
      console.error('수분 섭취량 설정 에러', error);
    }
  };

  // 기록하기 버튼
  const onSubmit = async (data) => {
    try {
      const newAmount = data.waterAmount;
      const current = waterData?.dailyTotal ?? 0;

      // 현재 값이랑 수정한 값이 같으면 저장 x
      if (newAmount === current) {
        toast.success('변경된 내용이 없어요!');
        return;
      }

      await addWaterIntakeMutation.mutateAsync({
        date: formattedSaveDate,
        amount: data.waterAmount,
      });
      navigate('/');
    } catch (error) {
      console.error('수분 기록 에러: ', error);
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
      <WaterAmountInput control={control} waterStep={waterStep} />

      <div className='flex flex-col gap-[40px]'>
        {/* 수분 섭취량 */}
        <WaterSettings
          oneTimeIntake={oneTimeIntake}
          targetIntake={targetIntake}
          onOpenModal={() => setOpenModal(true)}
        />

        <BasicButton size='full' onClick={handleSubmit(onSubmit)}>
          기록하기
        </BasicButton>
      </div>

      <WaterIntakeModal
        isOpenModal={openModal}
        onCloseModal={() => setOpenModal(false)}
        onBtnClick={saveWaterIntakeSettings}
        oneTimeIntake={oneTimeIntake}
        targetIntake={targetIntake}
      />
    </div>
  );
}
