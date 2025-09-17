import React from 'react';
import logoImage from '@/assets/images/Group99.png';
// 컴포넌트
import Input from '@/components/common/Input';
import BasicButton from '../../components/button/BasicButton';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col gap-8 justify-center items-center bg-white w-full h-full min-h-screen'>
      <div className='flex justify-center items-center pb-8'>
        <img className='w-full h-30' src={logoImage} alt='오늘의 냠냠 로고' />
      </div>
      {/* login form section */}
      <div className='flex flex-col items-center mb-4 w-full'>
        <div className='flex flex-col gap-[8px] w-full px-8 mb-4'>
          <Input id='userId' placeholder='이메일 입력' />
        </div>
        <div className='flex flex-col gap-[8px] w-full px-8'>
          <Input id='password' placeholder='비밀번호 입력' />
        </div>
      </div>
      {/* login form Button section */}
      <div className='flex flex-col items-center w-full px-8'>
        <div className='w-full mb-3'>
          <BasicButton size='full' onClick={() => {}}>
            로그인
          </BasicButton>
        </div>
        <BasicButton
          size='full'
          variant='line'
          onClick={() => {
            navigate('/signup');
          }}
        >
          회원가입
        </BasicButton>
      </div>
    </div>
  );
}
