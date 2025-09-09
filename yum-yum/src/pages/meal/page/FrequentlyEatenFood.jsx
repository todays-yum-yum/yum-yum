import React, { useState } from 'react';
// 컴포넌트
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';

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

export default function FrequentlyEatenFood() {
  const [selectedIds, setSelectedIds] = useState([]);
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    console.log(id);
  };

  return (
    <div>
      <div className='flex flex-col min-h-[calc(100vh-206px)]'>
        <div className='flex-1 px-[20px]'>
          {foodItems.length > 0 ? (
            <FoodList
              variant='select'
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
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
