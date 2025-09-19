import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import logoImage from '@/assets/images/Group99.png';
// 컴포넌트
import Input from '@/components/common/Input';
import BasicButton from '../../components/button/BasicButton';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LoginPage() {
  const { login: setLogin } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    // console.log('Form Data:', data);
    // 로그인 로직
    const result = await setLogin(data.userId, data.password);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className='flex flex-col gap-8 justify-center items-center bg-white w-full h-full min-h-screen'>
      <div className='flex justify-center items-center pb-8'>
        <img className='w-full h-30' src={logoImage} alt='오늘의 냠냠 로고' />
      </div>
      {/* login form section */}
      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center mb-4 w-full'>
          <div className='flex flex-col gap-[8px] w-full px-8 mb-4'>
            <Controller
              name='userId'
              control={control}
              rules={{
                required: '이메일을 입력해주세요',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '올바른 이메일 형식을 입력해주세요',
                },
              }}
              render={({ field }) => (
                <Input
                  id='userId'
                  placeholder='이메일 입력'
                  type='email'
                  value={field.value}
                  onChange={field.onChange}
                  status={errors.userId ? 'error' : 'default'}
                  errorMessage={errors.userId?.message}
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-[8px] w-full px-8'>
            <Controller
              name='password'
              control={control}
              rules={{
                required: '비밀번호를 입력해주세요',
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상, 20자 이하여야 합니다.',
                },
                maxLength: {
                  value: 20,
                  message: '비밀번호는 8자 이상, 20자 이하여야 합니다.',
                },
                pattern: {
                  value: /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/,
                  message: '비밀번호는 영문자, 숫자, 특수문자가 최소 1개 이상 있어야합니다.',
                },
              }}
              render={({ field }) => (
                <Input
                  id='password'
                  type='password'
                  placeholder='비밀번호 입력'
                  value={field.value}
                  onChange={field.onChange}
                  status={errors.password ? 'error' : 'default'}
                  errorMessage={errors.password?.message}
                />
              )}
            />
          </div>
        </div>
        {/* login form Button section */}
        <div className='flex flex-col items-center w-full px-8'>
          <div className='w-full mb-3'>
            <BasicButton type='submit' size='full' onClick={handleSubmit}>
              로그인
            </BasicButton>
          </div>
          <BasicButton
            size='full'
            variant='line'
            onClick={() => {
              navigate('/signup');
            }}
            type='button'
          >
            회원가입
          </BasicButton>
        </div>
      </form>
    </div>
  );
}
