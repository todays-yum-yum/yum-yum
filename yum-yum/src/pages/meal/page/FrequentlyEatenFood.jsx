import React, { useEffect, useState } from 'react';
import { getRecentFoods } from '@/services/FrequentFoodsApi';
import { callUserUid } from '@/utils/localStorage';
// 컴포넌트
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';

export default function FrequentlyEatenFood({ selectedIds, onToggleSelect }) {
  const userId = callUserUid(); // 로그인한 유저 uid 가져오기
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getRecentFoods(userId);
        setFoodItems(data);
      } catch (error) {
        console.error('불러오기 실패:', error);
        throw error;
      }
    };
    fetchFoods();
  }, []);

  return (
    <div>
      <div className='flex flex-col min-h-[calc(100vh-206px)]'>
        <div className='flex-1 px-[20px]'>
          {foodItems.length > 0 ? (
            <FoodList
              variant='select'
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              items={foodItems}
            />
          ) : (
            <EmptyState className='min-h-[calc(100vh-266px)]'>자주 먹은 음식이 없어요</EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
