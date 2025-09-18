import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { customFoodsList } from '@/services/customFoodsApi';
// 컴포넌트
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';
// 아이콘
import SearchIcon from '@/assets/icons/icon-search.svg?react';

export default function CustomEntry({ selectedIds, onToggleSelect }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { type } = useParams();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const date = location.state?.date;

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await customFoodsList('test-user');
        setFoodItems(data);
      } catch (error) {
        console.error('불러오기 실패:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // 직접 등록 폼으로 이동
  const handleCustomEntry = () => {
    navigate('/meal/custom', {
      state: { date, type },
    });
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='sticky top-[118px] z-30 flex justify-between items-center px-5 py-3 bg-gray-50'>
        {/* 직접 등록 버튼 */}
        <div className='flex gap-2 items-center'>
          <div className='flex items-center justify-center'>
            <SearchIcon />
          </div>
          <p className='text-gray-700'>찾는 음식이 없나요?</p>
        </div>

        <button
          onClick={handleCustomEntry}
          className='bg-secondary rounded-full text-white font-bold text-sm px-4 py-2'
        >
          직접 등록
        </button>
      </div>

      <div className='flex flex-col min-h-[calc(100vh-266px)]'>
        <div className='flex-1 px-[20px]'>
          {foodItems.length > 0 ? (
            <FoodList
              variant='select'
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              items={foodItems}
            />
          ) : (
            <EmptyState className='min-h-[calc(100vh-266px)]'>등록한 음식이 없어요</EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
