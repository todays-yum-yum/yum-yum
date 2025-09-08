/**
 * 전체 카드 컨테이너
 * 카드 스타일링 (border-radius, shadow 등)
 */
import React from 'react';

export default function BaseCard({ children }) {
  return (
    <div className='bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] '>
      {children}
    </div>
  );
}
