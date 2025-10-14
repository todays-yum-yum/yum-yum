import React from 'react';
import { useFormContext } from 'react-hook-form';
// 컴포넌트
import AgreementsSection from '../components/AgreementsSection';
import BasicButton from '@/components/button/BasicButton';
// 이미지
import symbol from '@/assets/images/symbol.png';

export default function SignupAgreements({ onNext }) {
  const { handleSubmit } = useFormContext();

  return (
    <div className='flex flex-col justify-between min-h-[calc(100vh-60px)]'>
      <div className='flex-1'>
        <div className='flex flex-col gap-[28px] p-[40px] pt-[80px]'>
          <div className='w-[72px] h-[72px]'>
            <img className='w-full' src={symbol} alt='오늘의 냠냠 로고' />
          </div>
          <h3 className='text-3xl font-bold leading-12 '>
            오늘의 냠냠에 <br />
            오신 것을 환영합니다!
          </h3>
        </div>
      </div>

      <AgreementsSection />

      <div className='sticky bottom-0 z-30 flex gap-[12px] p-[20px] bg-white'>
        <BasicButton type='button' size='full' onClick={handleSubmit(onNext)}>
          다음
        </BasicButton>
      </div>
    </div>
  );
}
