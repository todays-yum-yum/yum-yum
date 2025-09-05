// 플로팅 버튼 컴포넌트
import React, { useState } from 'react';
import IconPlus from '@/assets/icons/icon-plus-line.svg?react';
import IconClose from '@/assets/icons/icon-close.svg?react';
import IconDrop from '@/assets/icons/icon-drop.svg?react';
import IconMeal from '@/assets/icons/icon-restaurant.svg?react';
import MenuModal from '@/components/modal/MenuModal';
import { useNavigate } from 'react-router-dom';
import RoundButton from './RoundButton';

export default function FloatButton({ onClick, isOpen, isClose, disabled }) {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className='absolute bottom-20 right-4 flex flex-col gap-2 items-end '>
      {/* 플로팅 버튼 클릭했을 때 위에 뜨는 메뉴들 */}
      {isOpen && (
        <div className='space-y-2 flex flex-col z-50'>
          <RoundButton
            onClick={() => {
              navigate('/water');
            }}
            color='gray'
            variant='filled'
          >
            <IconDrop className='w-6 h-6' />
            <span className='pl-2'>물 추가하기</span>
          </RoundButton>
          <RoundButton
            onClick={() => {
              setModalOpen(true);
            }}
            color='gray'
            variant='filled'
          >
            <IconMeal className='w-6 h-6' />
            <span className='pl-2'>식단 추가하기</span>
          </RoundButton>
        </div>
      )}
      {/* 플로팅 버튼 */}
      <button
        className='p-3 w-[48px] rounded-full bg-primary text-white shadow-lg'
        onClick={isClose}
        disabled={disabled}
      >
        {isOpen ? (
          <IconClose width='24' height='24' fill='#ffffff' />
        ) : (
          <IconPlus width='24' height='24' fill='#ffffff' />
        )}
      </button>

      <MenuModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
