import React from 'react';
import RoundButton from '@/components/button/RoundButton';
import mainLogo from '@/assets/images/Group99.png';
// carousel images
import carousel1 from '@/assets/images/Frame37090.png';
import carousel2 from '@/assets/images/Frame37089.png';
import carousel3 from '@/assets/images/Frame37088.png';
import { useNavigate } from 'react-router-dom';
import Carousel from './carousel/CustomCarousel';

export default function NonUserHomePage() {
  const naviagte = useNavigate();
  // carousel images list
  const carouselImages = [carousel1, carousel2, carousel3];

  return (
    <div className='flex flex-col gap-8 justify-center items-center bg-white w-full h-full min-h-screen'>
      {/* <div className='w-full max-w-md mx-auto overflow-hidden min-h-screen flex flex-col'> */}
      {/* 로고 섹션 */}
      <div className='flex justify-center items-center pt-35 pb-8'>
        <img className='w-30 h-30' src={mainLogo} alt='오늘의 냠냠 로고' />
      </div>

      {/* 메인 컨텐츠 영역 - flex-grow로 남은 공간 채우기 */}
      <div className='flex-grow flex flex-col justify-between px-5 pb-10'>
        {/* 여백 공간 */}
        <div className='flex-grow'></div>

        {/* 캐러셀 섹션 */}
        <div className='flex flex-col items-center mb-20'>
          <Carousel images={carouselImages} />
        </div>

        {/* 하단 버튼 섹션 */}
        <div className='w-full'>
          <RoundButton
            size='full'
            onClick={() => {
              naviagte('/login');
            }}
          >
            로그인하고 시작하기
          </RoundButton>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
