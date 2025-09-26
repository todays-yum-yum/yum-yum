import React, { useEffect } from 'react';
// 컴포넌트
import BasicButton from '../button/BasicButton';

export default function ConfirmModal({
  isOpenModal,
  onCloseModal,
  onConfirm,
  title,
  desc,
  leftBtnLabel = '취소',
  rightBtnLabel = '확인',
}) {
  // 모달 호출 시 스크롤 막기
  useEffect(() => {
    if (!isOpenModal) return;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpenModal]);

  if (!isOpenModal) return null;

  return (
    <>
      <div
        onClick={onCloseModal}
        className='fixed z-40 left-1/2 bottom-0 -translate-x-1/2 w-full max-w-[500px] h-full bg-black opacity-60'
      ></div>

      <div className='fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-5/6 max-w-[360px] bg-white p-[20px] rounded-3xl'>
        <div className='flex flex-col gap-[16px] items-center justify-between py-[20px]'>
          <h2 className='font-bold text-lg'>{title}</h2>
          {desc && <p className='text-gray-600 text-sm'>{desc}</p>}
        </div>

        <div className='flex gap-[12px] bg-white pt-[20px]'>
          <BasicButton onClick={onCloseModal} size='full' variant='line'>
            {leftBtnLabel}
          </BasicButton>
          <BasicButton onClick={onConfirm} size='full'>
            {rightBtnLabel}
          </BasicButton>
        </div>
      </div>
    </>
  );
}
