import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { firestore } from '@/services/firebase';
import { deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import toast from 'react-hot-toast';
// 스토어
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 유틸
import { toNum } from '@/utils/nutrientNumber';
import { callUserUid } from '@/utils/localStorage';
// 서비스
import { saveMeal } from '@/services/mealApi';
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
  const queryClient = useQueryClient();
  const { type } = useParams();

  const MEAL_LABELS = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
    snack: '기타',
  }[type];

  const selectedDate = location.state?.date || defaultDate;
  const formattedDate = format(selectedDate, dateFormat, { locale: ko });
  const foods = Object.values(selectedFoods); // 선택된 음식
  const foodCount = foods.length; // 선택된 음식 개수
  // 총 칼로리
  const totalKcal = useMemo(
    () => foods.reduce((sum, food) => sum + Number(food.nutrient?.kcal), 0),
    [foods],
  );

  // - 버튼
  const handleRemove = (id) => {
    deleteFood(id);
    toast.success('삭제 되었습니다');
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
      const formattedSaveDate = format(selectedDate, 'yyyy-MM-dd');

      // 삭제 처리
      if (foods.length === 0) {
        const mealRef = doc(firestore, 'users', userId, 'meal', formattedSaveDate);
        await deleteDoc(mealRef);

        // 캐시 무효화
        queryClient.invalidateQueries(['dailyData', userId, formattedSaveDate]);
        navigate('/', { replace: true });
        return;
      }

      const meals = foods.map((f) => ({
        id: f.id,
        mealType: type ?? 'type',
        foodName: f.foodName ?? 'foodName',
        makerName: f.makerName ?? '',
        foodSize: f.foodSize ?? 0,
        foodUnit: f.foodUnit ?? 'g',
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

      await saveMeal(userId, formattedSaveDate, type, meals);

      toast.success('기록이 완료 되었어요!');
      clearFoods();

      // 캐시 무효화
      queryClient.invalidateQueries(['dailyData', userId, formattedSaveDate]);
      navigate('/', { replace: true });
    } catch (error) {
      toast.error('식단 기록 실패!');
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
