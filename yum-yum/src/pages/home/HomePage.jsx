/**
 * 메인 페이지
 */
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
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
import NumberInput from '@/components/common/NumberInput';
// 훅
import { useWeightModal } from '@/hooks/useWeight';
import { usePageData } from '@/hooks/useMainPageData';
// 스토어
import { useHomeStore } from '@/stores/useHomeStore';
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 아이디 호출
import { callUserUid } from '@/utils/localStorage';
import MyDateField from './modal/MyDateField';

registerLocale('ko', ko);

export default function HomePage() {
  const userId = callUserUid();
  const navigate = useNavigate();
  // zustand에서 UI 상태
  const {
    selectedDate,
    setSelectedDate,
    calendarOpen,
    setCalendarOpen,
    onboardOpen,
    setOnboardOpen,
    originalMealData,
    isExacDate,
    displayText,
  } = useHomeStore();
  // hoook 요청
  const { waterData, mealData, targetCalories, currentWeight, goalWeight } = usePageData(
    userId,
    selectedDate,
  );
  const weightModal = useWeightModal(userId, selectedDate, currentWeight);
  const { clearFoods, addFood } = useSelectedFoodsStore();

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
          className='shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'
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
            onWeightInput={weightModal.open}
            isExacDate={isExacDate}
            displayText={displayText}
          />
        </BaseCard>

        {weightModal.weightModalOpen && (
          <Modal
            isOpenModal={weightModal.weightModalOpen}
            onCloseModal={weightModal.close}
            title='체중 입력'
            showClose={true}
            btnLabel='확인'
            onBtnClick={weightModal.onSubmit}
          >
            {/* 날짜 선택 부분 */}
            <MyDateField {...weightModal} />
            {/* 몸무게 입력 부분 */}
            <NumberInput
              name={'weight'}
              register={weightModal.register}
              errors={weightModal.formState.errors}
              unit='kg'
              min={30}
              max={200}
              validationRules={{
                min: { value: 20, message: '20kg 이상 입력해주세요.' },
                max: { value: 300, message: '300kg 이하로 입력해주세요.' },
                pattern: {
                  value: /^(?:\d{1,3}(?:\.\d{1})?|\d{1,2})$/,
                  message: '숫자만 입력 가능하며, 소수점 첫째 자리까지만 입력해주세요',
                },
              }}
            />
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
                const copy = originalMealData?.[mealType];
                copy.map((meal) => addFood(meal));
                navigate(`/meal/${mealType}/total`, {
                  state: { date: selectedDate, formMain: true },
                });
              }}
              onAddWater={() => {
                navigate(`/water`, { state: { date: selectedDate } });
              }}
              // wholeData={{water: waterDataOrigin, meal: mealDataOrigin, weight}}
            />
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
