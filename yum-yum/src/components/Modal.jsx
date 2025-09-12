import React, { use, useEffect } from 'react';
// 컴포넌트
import BasicButton from './button/BasicButton';
// 아이콘
import CloseIcon from '@/assets/icons/icon-close.svg?react';

export default function Modal({
  isOpenModal,
  onCloseModal,
  title,
  children,
  showClose = false, // 닫기 버튼 여부
  btnLabel, // 버튼명
  onBtnClick, // 버튼 클릭
  btnDisabled = false, // 버튼 비활성화 여부
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

      <div className='fixed z-50 left-1/2 bottom-0 -translate-x-1/2 flex flex-col w-full max-w-[500px] bg-white px-[20px] pt-[20px] rounded-t-3xl'>
        <div className='flex items-center justify-between pb-[20px]'>
          <h2 className='font-bold text-lg'>{title}</h2>

          {showClose && (
            <button onClick={onCloseModal} className='flex items-center justify-center'>
              <CloseIcon />
            </button>
          )}
        </div>

        <div>{children}</div>

        {btnLabel && (
          <div className='bg-white py-[20px]'>
            <BasicButton onClick={onBtnClick} size='full' disabled={btnDisabled}>
              {btnLabel}
            </BasicButton>
          </div>
        )}
      </div>
    </>
  );
}
