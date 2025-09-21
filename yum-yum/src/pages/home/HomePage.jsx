/**
 * 메인 페이지
 */
import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
// 컴포넌트
import DateHeader from '@/components/common/DateHeader';
import OnBoarding from '@/components/common/OnBoarding';
import Modal from '@/components/Modal';
import BaseCard from './card/BaseCard';
import MealCard from './card/nutrition/MealCard';
import WeightCard from './card/weight/WeightCard';
import CalorieCard from './card/calorie/CalorieCard';
import CalorieChart from './card/calorie/CalorieChart';
import CalorieHeader from './card/calorie/CalorieHeader';
import CalorieMessage from './card/calorie/CalorieMessage';
import CalorieNutrition from './card/calorie/CalorieNutrition';
import WeightInput from './modal/WeightInput';
// 훅
import { useWeight } from '../../hooks/useWeight';
import { usePageData } from '../../hooks/useMainPageData';
import { useUserData } from '../../hooks/useUser';
// 스토어
import { useHomeStore } from '../../stores/useHomeStore';
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 아이디 호출
import { callUserUid } from '@/utils/localStorage';

registerLocale('ko', ko);

export default function HomePage() {
  const userId = callUserUid(); // test용 ID 추후 쿠키에서 불러오는 방향으로 수정
  const navigate = useNavigate();
  // zustand에서 UI 상태
  const {
    selectedDate,
    setSelectedDate,
    calendarOpen,
    setCalendarOpen,
    onboardOpen,
    setOnboardOpen,
    weightModalOpen,
    setWeightModalOpen,
    targetCalories,
    calcuateCalories,
    currentWeight,
    goalWeight,
    setDailyData,
    waterData,
    mealData, // 필요한 부분 파싱된 데이터
  } = useHomeStore();
  const { saveWeightMutation } = useWeight(userId, selectedDate);
  const { dailyData, dailyLoading } = usePageData(userId, selectedDate);
  const { userData } = useUserData(userId, selectedDate);
  const { clearFoods, addFood } = useSelectedFoodsStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { weight: '' },
    mode: 'onSubmit',
  });

  // userData가 변경되면 다시 계산
  useEffect(() => {
    if (userData) {
      calcuateCalories(userData);
    }
  }, [userData, calcuateCalories]);

  useEffect(() => {
    if (dailyData) {
      setDailyData(dailyData, userData);
    }
  }, [dailyData]);

  // 체중 저장
  const onSubmit = async (data) => {
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
          date={selectedDate}
          onCalendarClick={() => {
            setCalendarOpen(!calendarOpen);
          }}
          onOnBoardClick={() => {
            setOnboardOpen(true);
          }}
        />
        {calendarOpen && (
          <div className='absolute z-10 mt-2 left-[120px]'>
            {/* 래퍼 div 추가 */}
            <DatePicker
              dateFormat='yyyy.MM.dd'
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
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
            <CalorieMessage
              currentCalories={mealData?.currentCalories || 0}
              totalCalories={targetCalories}
            />
            {/* 차트 */}
            <CalorieChart
              currentCalories={mealData?.currentCalories || 0}
              totalCalories={targetCalories}
            />
            {/* 영양소 정보 */}
            <CalorieNutrition
              carbs={mealData?.carbs || 0}
              protein={mealData?.protein || 0}
              fat={mealData?.fat || 0}
            />
          </CalorieCard>
        </BaseCard>

        {/* 체중 정보 카드 */}
        <BaseCard>
          <WeightCard
            currentWeight={currentWeight}
            targetWeight={goalWeight}
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
                _id: mealData?.id ?? 0,
                breakfast: {
                  calories: mealData?.breakfast.calories ?? 0,
                  foods: mealData?.breakfast.foods ?? null,
                },
                lunch: {
                  calories: mealData?.lunch.calories ?? 0,
                  foods: mealData?.lunch.foods ?? null,
                },
                dinner: {
                  calories: mealData?.dinner.calories ?? 0,
                  foods: mealData?.dinner.foods ?? null,
                },
                snack: {
                  calories: mealData?.snack.calories ?? 0,
                  foods: mealData?.snack.foods ?? null,
                },
              }}
              water={{ current: waterData?.current ?? 0, goal: waterData?.goal ?? 0 }}
              onAddMeal={(id, mealType) => {
                navigate(`/meal/${mealType}`, {
                  state: { date: selectedDate, formMain: true },
                });
              }}
              onUpdateMeal={(id, mealType) => {
                clearFoods(); // zustand에 이미 저장되어있는 선택값 clear()
                // selected zustand에 값 추가
                const copy = dailyData.mealData[id].meals[mealType];
                copy.map((meal) => addFood(meal));
                navigate(`/meal/${mealType}/total`, {
                  state: { date: selectedDate },
                });
              }}
              onAddWater={() => {
                navigate(`/water`, { state: { date: selectedDate } });
              }}
              wholeData={dailyData}
            />
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
