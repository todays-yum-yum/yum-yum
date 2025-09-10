import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 컴포넌트
import MealHeader from '../component/MealHeader';
import FoodList from '../component/FoodList';
import BasicButton from '@/components/button/BasicButton';
import TotalBarChart from '../component/TotalBarChart';

const foodItems = [
  {
    id: '1',
    foodName: '두유',
    makerName: '',
    foodWeight: '200',
    foodCal: '110',
  },
  {
    id: '2',
    foodName: '약콩두유',
    makerName: '대학두유',
    foodWeight: '190',
    foodCal: '100',
  },
  {
    id: '3',
    foodName: '약콩두유',
    makerName: '대학두유',
    foodWeight: '190',
    foodCal: '100',
  },
];

export default function TotalMeal() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState(foodItems);
  const foodCount = foods.length;

  const date = new Date();

  // - 버튼
  const handleDelete = (id) => {
    setFoods((prev) => prev.filter((item) => item.id !== id));
  };

  // 음식 추가 버튼
  const handleAddFood = () => {
    navigate('/meal');
  };

  // 기록 완료 버튼
  const handleSubmitRecord = () => {
    navigate('/');
  };

  return (
    <div>
      {/* 헤더 */}
      <MealHeader>{date.toLocaleDateString()} 아침</MealHeader>

      <div className='flex flex-col min-h-[calc(100vh-60px)]'>
        <div className='flex-1 px-[20px]'>
          {/* 총 열량 */}
          <div className='pb-[24px]'>
            <div className='flex flex-col gap-[20px] px-[32px] py-[28px] bg-secondary-light rounded-2xl'>
              <div className='flex justify-between text-lg font-bold'>
                <h3>총 열량</h3>
                <p>210kcal</p>
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
            <FoodList variant='delete' onDelete={handleDelete} items={foods} />
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
