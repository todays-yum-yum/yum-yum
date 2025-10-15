import React, { useEffect, useState } from 'react';
import SettingIcon from '@/assets/icons/icon-setting.svg?react';
import { callUserUid } from '@/utils/localStorage';
import { useMyPageUserData } from '@/hooks/useMyPageUser';

import MyPageGoalCard from '../component/MyPageGoalCard';
import MyPageCSItem from '../component/MyPageCSItem';
import TOSModal from '../component/TOSModal';

import { differenceInDays } from 'date-fns';

import { useUserStore } from '@/stores/useUserStore';


export default function MyPageMain() {
  const userId = callUserUid();
  const { userName, goal, targetWeight, targetExercise, createAt } = useMyPageUserData(userId);

  const { logout } = useUserStore();

  // 가입일
  const [dDays, setDDays] = useState(0);

  // 모달
  const [openModal, setOpenModal] = useState(null);

  useEffect(() => {
    // console.log(userData);
    setDDays(getDDays(createAt));
  }, [createAt]);

  // 가입일로부터 날짜 계산
  const getDDays = (timestamp) => {
    const signUpDate = new Date(timestamp * 1000);
    const today = new Date();

    // console.log(signUpDate, today)

    return differenceInDays(today, signUpDate);
  };

  return (
    <div className='flex flex-col gap-5 px-5 justify-around item-center bg-gray-50 w-full h-[calc(100vh-122px)] overflow-y-auto'>
      <div className='flex flex-col gap-5'>
        {/* 상단 */}
        <div className='flex flex-col bg-white rounded-[20px] gap-7 p-7'>
          {/* 이름과 기록일 */}
          <div className='flex flex-row justify-between items-baseline'>
            <div>
              <span className='text-2xl text-primary font-bold'>{userName? userName : ''} </span>
              <span className='text-base font-bold text-gray-400'>{'님'}</span>
            </div>

            <div className='text-center bg-secondary-light rounded-[8px] px-3.5 py-2'>
              <span className='text-base text-secondary font-bold'>{dDays ? dDays : 0} </span>
              <span className='text-base font-bold text-gray-400'>{'일 기록 중 📈'}</span>
            </div>
          </div>

          {/* 나의 목표 */}
          <div className='flex flex-col bg-primary-light rounded-[12px] gap-8 p-7'>
            <div className='flex flex-row justify-between items-center'>
              <span className='text-xl font-bold'>나의 목표</span>
              <button>
                <SettingIcon />
              </button>
            </div>

            <div>
              <MyPageGoalCard
                goals={{
                  '목표 체중': `${targetWeight ?? 0} kg`,
                  '목표 설정': goal,
                  활동량: targetExercise,
                }}
              />
            </div>
          </div>
        </div>

        {/* 고객 지원 */}
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col bg-white rounded-[20px] gap-7 p-7'>
            <div className='flex flex-col justify-between items-baseline gap-5'>
              <div>
                <span className='text-xl font-bold'>고객지원</span>
              </div>

              <MyPageCSItem label={'문의하기'} />

              <MyPageCSItem label={'서비스 이용약관'} type='service' setOpenModal={setOpenModal} />

              <MyPageCSItem
                label={'개인정보 처리 방침'}
                type='privacy'
                setOpenModal={setOpenModal}
              />

              <MyPageCSItem
                label={'민감정보 처리 방침'}
                type='sensitive'
                setOpenModal={setOpenModal}
              />

              <MyPageCSItem label={'회원 탈퇴'} />
            </div>
          </div>

          <div className='flex justify-end'>
            <span className='text-sm text-gray-500 underline cursor-pointer' onClick={logout}>
              로그아웃
            </span>
          </div>
        </div>
      </div>

      <div className='flex justify-center'>
        <span className='text-center text-sm text-gray-500'>© 2025 TODAYS YUM YUM. All rights reserved.</span>
      </div>

      {openModal && (
        <TOSModal
          isOpenModal={!!openModal}
          onCloseModal={() => setOpenModal(null)}
          type={openModal}
        />
      )}
    </div>
  );
}
