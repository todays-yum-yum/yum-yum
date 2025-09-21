import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
// 컴포넌트
import Header from '@/components/Header';
import SignupStep1 from './pages/SignupStep1';
import SignupStep2 from './pages/SignupStep2';
import useAuth from '../../../hooks/useAuth';

export default function SignUpPage() {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      pw: '',
      pwCheck: '',
      gender: '',
      age: '',
      height: '',
      weight: '',
      agreeAll: false,
      service: false,
      privacy: false,
      sensitive: false,
      goals: '',
      targetWeight: '',
      targetExercise: '',
    },
    mode: 'onBlur',
  });
  const { signUp } = useAuth();
  const [signUpStep, setSignUpStep] = useState(1);

  const onSubmit = (data) => {
    // console.log('회원가입 데이터:', data);
    try {
      signUp(data);
      toast.success('회원가입 완료');
    } catch (error) {
      toast.error('회원가입 실패');
    }
    navigate('/', {
      replace: true,
    });
  };

  return (
    <div>
      <Header />
      <div className='flex items-center justify-between px-[20px] py-[20px]'>
        <h3 className='text-2xl font-bold'>회원가입</h3>
        <div className='w-[60px] py-1 bg-gray-200 font-bold text-center rounded-full'>
          {signUpStep} / 2
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {signUpStep === 1 && <SignupStep1 onNext={() => setSignUpStep(2)} />}
          {signUpStep === 2 && <SignupStep2 onPrev={() => setSignUpStep(1)} />}
        </form>
      </FormProvider>
    </div>
  );
}
