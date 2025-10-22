import React from 'react';
// 훅
import { useRecentFoods } from '@/hooks/useRecentFoods';
// 유틸
import { callUserUid } from '@/utils/localStorage';
// 컴포넌트
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';
import FoodListSkeleton from '@/components/skeleton/FoodListSkeleton';

export default function FrequentlyEatenFood({ selectedIds, onToggleSelect }) {
  const userId = callUserUid(); // 로그인한 유저 uid 가져오기
  const { foodItems, isLoading, isError } = useRecentFoods(userId);

  return (
    <div>
      <div className='flex flex-col min-h-[calc(100vh-206px)]'>
        <div className='flex-1 px-[20px]'>
          {isError ? (
            // API 에러
            <EmptyState className='min-h-[calc(100vh-266px)] text-center'>
              서버와의 연결에 문제가 있습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </EmptyState>
          ) : isLoading ? (
            // 로딩 중
            <FoodListSkeleton />
          ) : foodItems.length > 0 ? (
            <FoodList
              variant='select'
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              items={foodItems}
            />
          ) : (
            <EmptyState className='min-h-[calc(100vh-266px)]'>자주 먹은 음식이 없어요</EmptyState>
          )}
          {}
        </div>
      </div>
    </div>
  );
}
