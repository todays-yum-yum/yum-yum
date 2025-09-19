// 온보드 화면(전체화면)
import React, { useEffect } from 'react';
import BasicButton from '@/components/button/BasicButton';

export default function OnBoarding({ isOpen = false, onClose }) {
  // 온보딩 호출 시 스크롤 막기
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-white'>
      <div className='w-full h-full overflow-auto flex items-start justify-center'>
        <div className='relative max-w-full'>
          {/* 전체화면을 채우는 이미지  */}
          <img src='onboarding.png' alt='온보딩 이미지' className='max-w-full h-auto' />
          {/* 닫기 버튼 */}
          <div className='absolute top-4 right-4 z-10 bg-white rounded-lg'>
            <BasicButton size='md' variant='line' onClick={onClose}>
              Skip
            </BasicButton>
          </div>
        </div>
      </div>
    </div>
  );
}
