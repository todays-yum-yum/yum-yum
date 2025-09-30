import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
// 스토어
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 훅
import { useDailyMeal } from '@/hooks/useDailyMeal';
// 유틸
import { toNum } from '@/utils/nutrientNumber';
import { callUserUid } from '@/utils/localStorage';
// 컴포넌트
import MealHeader from '../component/MealHeader';
import FoodList from '../component/FoodList';
import BasicButton from '@/components/button/BasicButton';
import TotalBarChart from '../component/TotalBarChart';
import EmptyState from '@/components/EmptyState';

export default function TotalMeal({ defaultDate = new Date(), dateFormat = 'MM월 dd일' }) {
  const userId = callUserUid(); // 로그인한 유저 uid 가져오기
  const { selectedFoods, deleteFood, clearFoods } = useSelectedFoodsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDate = location.state?.date || defaultDate;
  const formattedDate = format(selectedDate, dateFormat, { locale: ko });
  const foods = Object.values(selectedFoods); // 선택된 음식
  const foodCount = foods.length; // 선택된 음식 개수
  const formattedSaveDate = format(selectedDate, 'yyyy-MM-dd');
  const { saveDailyMeal, deleteDailyMeal } = useDailyMeal(userId, formattedSaveDate);
  const { type } = useParams();

  const MEAL_LABELS = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
    snack: '기타',
  }[type];

  // 총 칼로리
  const totalKcal = useMemo(
    () => foods.reduce((sum, food) => sum + Number(food.nutrient?.kcal), 0),
    [foods],
  );

  // - 버튼
  const handleRemove = (id) => {
    deleteFood(id);
  };

  // 음식 추가 버튼
  const handleAddFood = () => {
    navigate(`/meal/${type}`, {
      state: { date: selectedDate },
      replace: true,
    });
  };

  // 기록 완료 버튼
  const handleSubmitRecord = async () => {
    try {
      // 해당 type만 삭제 처리
      if (foods.length === 0) {
        await deleteDailyMeal.mutateAsync(type);
        navigate('/', { replace: true });
        return;
      }

      const meals = foods.map((f) => ({
        id: f.id,
        mealType: type ?? 'type',
        foodName: f.foodName ?? 'foodName',
        makerName: f.makerName ?? null,
        baseFoodSize: f.baseFoodSize ?? null, // 원본 기준량
        foodSize: f.foodSize ?? null,
        foodUnit: f.foodUnit ?? 'g',
        quantity: f.quantity ?? null,
        unit: f.unit ?? f.foodUnit,
        createdAt: Timestamp.now(),
        nutrient: {
          kcal: toNum(f.nutrient?.kcal),
          carbs: toNum(f.nutrient?.carbs),
          protein: toNum(f.nutrient?.protein),
          fat: toNum(f.nutrient?.fat),
          sugar: toNum(f.nutrient?.sugar),
          sweetener: toNum(f.nutrient?.sweetener),
          fiber: toNum(f.nutrient?.fiber),
          satFat: toNum(f.nutrient?.satFat),
          transFat: toNum(f.nutrient?.transFat),
          unsatFat: toNum(f.nutrient?.unsatFat),
          cholesterol: toNum(f.nutrient?.cholesterol),
          sodium: toNum(f.nutrient?.sodium),
          potassium: toNum(f.nutrient?.potassium),
          caffeine: toNum(f.nutrient?.caffeine),
        },
      }));

      await saveDailyMeal.mutateAsync({ type, meals });

      clearFoods();
      navigate('/', { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <MealHeader>
        {formattedDate} {MEAL_LABELS}
      </MealHeader>

      <div className='flex flex-col min-h-[calc(100vh-60px)]'>
        <div className='flex-1 px-[20px]'>
          {/* 총 열량 */}
          <div className='pb-[24px]'>
            <div className='flex flex-col gap-[20px] px-[32px] py-[28px] bg-secondary-light rounded-2xl'>
              <div className='flex justify-between text-lg font-bold'>
                <h3>총 열량</h3>
                <p>{Math.round(Number(totalKcal))}kcal</p>
              </div>

              <div className='w-full h-[80px]'>
                <TotalBarChart />
              </div>
            </div>
          </div>

          {/* 추가한 음식 */}
          <div className='pt-[24px] border-t-[12px] border-gray-50'>
            <h3 className='text-lg font-bold'>
              추가한 음식 <strong className='text-primary font-extrabold'>{foodCount}</strong>
            </h3>
            {foods.length > 0 ? (
              <FoodList variant='delete' onRemove={handleRemove} items={foods} />
            ) : (
              <EmptyState className='min-h-[calc(100vh-420px)]'>추가한 음식이 없어요</EmptyState>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className='sticky bottom-0 z-30 flex gap-[12px] w-full max-w-[500px] p-[20px] bg-white'>
          <BasicButton size='full' variant='line' onClick={handleAddFood}>
            음식 추가
          </BasicButton>
          <BasicButton size='full' onClick={handleSubmitRecord}>
            기록 완료
          </BasicButton>
        </div>
      </div>
    </div>
  );
}
