import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// 컴포넌트
import EmptyState from '@/components/EmptyState';
// 아이콘
import SearchIcon from '@/assets/icons/icon-search.svg?react';
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

export default function CustomEntry() {
  const [selectedIds, setSelectedIds] = useState([]);
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    console.log(id);
  };
  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center px-5 py-3 bg-gray-50'>
        {/* 직접 등록 버튼 */}
        <div className='flex gap-2 items-center'>
          <div className='flex items-center justify-center'>
            <SearchIcon />
          </div>
          <p className='text-gray-700'>찾는 음식이 없나요?</p>
        </div>

        <Link
          to='/meal/custom'
          className='bg-secondary rounded-full text-white font-bold text-sm px-4 py-2'
        >
          직접 등록
        </Link>
      </div>

      <div className='flex flex-col min-h-[calc(100vh-266px)]'>
        <div className='flex-1 px-[20px]'>
          {foodItems.length > 0 ? (
            <FoodList
              variant='select'
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
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
