import React, { useEffect, useState } from 'react';
import { toNum } from '@/utils/WaterNumber';
// 컴포넌트
import Modal from '@/components/Modal';
import Input from '@/components/common/Input';
// 아이콘
import LightIcon from '@/assets/icons/icon-light-bulb.svg?react';
import toast from 'react-hot-toast';

export default function WaterIntakeModal({
  isOpenModal,
  onCloseModal,
  onBtnClick,
  oneTimeIntake,
  targetIntake,
}) {
  const [validOneTime, setValidOneTime] = useState(true);
  const [validTarget, setValidTarget] = useState(true);
  const [localOneTime, setLocalOneTime] = useState(oneTimeIntake);
  const [localTarget, setLocalTarget] = useState(targetIntake);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpenModal) {
      setLocalOneTime(oneTimeIntake);
      setLocalTarget(targetIntake);
    }
  }, [isOpenModal, oneTimeIntake, targetIntake]);

  // 확인 버튼
  const handleConfirm = () => {
    onBtnClick(localOneTime, localTarget);
  };

  const intakeSetting = [
    {
      label: '1회 섭취량',
      value: localOneTime,
      placeholder: '50 ~ 1,000',
      onChange: (e) => setLocalOneTime(toNum(e.target.value)),
      onBlur: (e) => {
        const v = toNum(e.target.value);
        if (v === '' || v === 0) {
          toast.error('1회 섭취량을 입력해주세요');
          setValidOneTime(false);
        } else if (v < 50 || v > 1000) {
          toast.error('1회 섭취량은 50 ~ 1000ml 사이여야 해요!');
          setValidOneTime(false);
        } else {
          setValidOneTime(true);
        }
      },
    },
    {
      label: '목표 섭취량',
      value: localTarget,
      placeholder: '500 ~ 10,000',
      onChange: (e) => setLocalTarget(toNum(e.target.value)),
      onBlur: (e) => {
        const v = toNum(e.target.value);
        if (v === '' || v === 0) {
          toast.error('목표 섭취량을 입력해주세요');
          setValidTarget(false);
        } else if (v < 500 || v > 10000) {
          toast.error('목표 섭취량은 500 ~ 10000ml 사이여야 해요!');
          setValidTarget(false);
        } else {
          setValidTarget(true);
        }
      },
    },
  ];
  return (
    <Modal
      isOpenModal={isOpenModal}
      onCloseModal={onCloseModal}
      title='수분 섭취량 설정'
      btnLabel='확인'
      onBtnClick={handleConfirm}
      showClose={true}
      btnDisabled={!validOneTime || !validTarget || localOneTime === 0 || localTarget === 0}
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
                placeholder={item.placeholder}
                noSpinner
                onChange={item.onChange}
                onBlur={item.onBlur}
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
