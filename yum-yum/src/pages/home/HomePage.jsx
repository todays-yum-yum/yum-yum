/**
 * 메인 페이지
 */
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import DateHeader from '@/components/common/DateHeader';
import OnBoarding from '@/components/common/OnBoarding';
import BaseCard from './card/BaseCard';
import MealCard from './card/nutrition/MealCard';
import WeightCard from './card/weight/WeightCard';
import CalorieCard from './card/calorie/CalorieCard';
import CalorieChart from './card/calorie/CalorieChart';
import CalorieHeader from './card/calorie/CalorieHeader';
import CalorieMessage from './card/calorie/CalorieMessage';
import CalorieNutrition from './card/calorie/CalorieNutrition';
import Modal from '@/components/Modal';
import { useWeight } from '../../hooks/useWeight';
import WeightInput from './modal/WeightInput';

registerLocale('ko', ko);
const userId = 'test-user';

export default function HomePage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [calendarOepn, setCalendarOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [weightModalOpen, setWeightModalOpen] = useState(false);

  const { saveWeightMutation } = useWeight(userId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: { weight: '' },
    mode: 'onSubmit',
  });

  useEffect(() => {
    // 불러오기
  }, []);

  // 체중 저장
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const saveWeight = saveWeightMutation.mutateAsync({ weight: parseFloat(data.weight) });

      await toast.promise(saveWeight, {
        loading: '저장하는 중...',
        success: (response) => {
          setWeightModalOpen(false);
          reset();
          return response?.message || '몸무게가 성공적으로 저장되었습니다!';
        },
        error: (error) => {
          return error?.message || '몸무게 저장에 실패했습니다.';
        },
      });
    } catch (errors) {
      console.error('체중 저장 실패', errors);
    }
  };

  return (
    <div className='flex flex-col gap-8 justify-start item-center bg-primary-light w-full h-full min-h-screen'>
      {/* 최상단 날짜 */}
      <div className='w-full h-full'>
        <DateHeader
          date={date}
          onCalendarClick={() => {
            setCalendarOpen(!calendarOepn);
          }}
          onOnBoardClick={() => {
            setOnboardOpen(true);
          }}
        />
        {calendarOepn && (
          <div className='absolute z-10 mt-2 left-[120px]'>
            {/* 래퍼 div 추가 */}
            <DatePicker
              dateFormat='yyyy.MM.dd'
              selected={date}
              onChange={(date) => {
                setDate(date);
                setCalendarOpen(false); // 날짜 선택 후 닫기
              }}
              minDate={new Date('2000-01-01')}
              maxDate={new Date()}
              locale='ko'
              inline // 인라인으로 표시
            />
          </div>
        )}
      </div>
      {/* OnBoarding 컴포넌트 */}
      <OnBoarding isOpen={onboardOpen} onClose={() => setOnboardOpen(false)} />

      {/* 카드 모음 */}
      <div className='w-full h-full px-4 flex flex-col justify-start gap-8 mb-8'>
        {/* 실시간 칼로리 카드 */}
        <BaseCard>
          <CalorieCard>
            {/* 헤더 */}
            <CalorieHeader />
            {/* 남은 칼로리 */}
            <CalorieMessage currentCalories={1900} totalCalories={1800} />
            {/* 차트 */}
            <CalorieChart currentCalories={1900} totalCalories={1800} />
            {/* 영양소 정보 */}
            <CalorieNutrition carbs={27.8} protein={5.7} fat={7.2} />
          </CalorieCard>
        </BaseCard>

        {/* 체중 정보 카드 */}
        <BaseCard>
          <WeightCard
            currentWeight={68}
            targetWeight={62}
            onWeightInput={() => {
              // 체중 입력 모달 열기 등의 로직
              setWeightModalOpen(true);
            }}
          />
        </BaseCard>

        {weightModalOpen && (
          <Modal
            isOpenModal={weightModalOpen}
            onCloseModal={() => setWeightModalOpen(false)}
            title='체중 입력'
            showClose={true}
            btnLabel='확인'
            onBtnClick={handleSubmit(onSubmit)}
          >
            <WeightInput register={register} errors={errors} />
          </Modal>
        )}

        {/* 실시간 식단 표 */}
        <BaseCard>
          <div className='p-6 sm:p-8'>
            <MealCard
              meals={{
                _id: 1,
                breakfast: {
                  calories: 280,
                  foods: '쌀밥, 미역국, 김치, 소고기장조림, 쌀밥, 미역국, 김치, 소고기장조림',
                },
                lunch: { calories: 0, foods: null },
                dinner: { calories: 0, foods: null },
                snack: { calories: 0, foods: null },
              }}
              water={{ current: 1.2, goal: 2.0 }}
              onAddMeal={(id, mealType) => {
                console.log(`${id}의 ${mealType} 식사 추가`);
                navigate(`/meal/${mealType}`);
              }}
              onUpdateMeal={(id, mealType) => {
                console.log(`${id}의 ${mealType} 식사 편집`);
                navigate(`/meal/total`);
              }}
              onAddWater={() => {
                navigate(`/water`);
              }}
            />
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
