import React, { useEffect, useRef, useState } from 'react';

export default function Carousel({ images, autoPlayDelay = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  // 다음 슬라이드 이동
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // 이전 슬라이드 이동
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // 특정 슬라이드 이동
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // 자동 재생 시작
  const startAutoPlay = () => {
    if (intervalRef.current) return; // 이미 실행중이면 중복 방지

    intervalRef.current = setInterval(() => {
      goToNext();
    }, autoPlayDelay);
  };

  // 자동 재생 중지
  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 자동 재생 토글
  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  // 자동 재생 제어
  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    // 컴포넌트 언마운트 시 정리
    return () => stopAutoPlay();
  }, [isAutoPlaying, autoPlayDelay]);

  return (
    <div className='relative w-full mx-auto'>
      {/* 이미지 컨테이너 */}
      <div className='overflow-hidden rounded-[20px]'>
        <div
          className='flex transition-transform duration-300 ease-in-out'
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`슬라이드 ${index + 1}`}
              className='w-full object-fit flex-shrink-0'
            />
          ))}
        </div>
      </div>

      {/* 인디케이터 */}
      <div className='flex justify-center gap-5 mt-5'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-emerald-800' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
