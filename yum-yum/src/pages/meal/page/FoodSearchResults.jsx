// 음식 검색 시, 검색 결과 확인 화면
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BasicButton from '@/components/button/BasicButton';
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';
import MealHeader from '../component/MealHeader';
import { useSearchFoodStore } from '../../../stores/useSearchFoodStore';
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
import { useSearchFoodData } from '../../../hooks/useSearchFoodData';

export default function FoodSearchResultsPage() {
  const location = useLocation();
  const searchItem = location.state?.searchInputValue; // 검색하는 음식 이름
  const type = location.state?.type; // 추가 타입
  const date = location.state?.date; // 추가 타입
  const { searchFoodResults: foodItems, setSearchFoodResults } = useSearchFoodStore();
  const { selectedFoods, clearFoods } = useSelectedFoodsStore();
  const { searchData, isLoading, isError, refetch } = useSearchFoodData(searchItem);
  const [searchInputValue, setSearchInputValue] = useState(searchItem || '');
  const navigate = useNavigate();

  // 음식 검색
  useEffect(() => {
    if (searchData) {
      console.log('검색결과:', searchData);
      setSearchFoodResults(searchData);
    }
  }, [searchData]);

  // 헤더 입력값
  const onSearchChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  // 돋보기 아이콘 클릭, 엔터
  const handleSearchSubmit = () => {
    // console.log(searchInputValue);
    // 같은 페이지로 navigate하되 검색어를 새로 전달
    navigate(`/meal/search`, {
      state: { searchInputValue: searchInputValue, type: type, date: date },
      replace: false,
    });
  };

  // 기록하기 버튼
  const handleRecord = () => {
    navigate(`/meal/${type}/total`, {
      state: { date },
    });
  };

  return (
    <>
      <MealHeader
        variant='search'
        value={searchInputValue}
        onChange={onSearchChange}
        handleSearchSubmit={handleSearchSubmit}
      />
      <div>
        <div className='flex flex-col min-h-[calc(100vh-206px)]'>
          <div className='flex-1 px-[20px]'>
            {foodItems?.length > 0 ? (
              <FoodList
                variant='select'
                // selectedIds={selectedIds}
                // onToggleSelect={handleToggleSelect}
                items={foodItems}
              />
            ) : (
              <EmptyState className='min-h-[calc(100vh-266px)]'>
                검색한 음식 결과가 없어요.
              </EmptyState>
            )}
          </div>
        </div>
      </div>
      <div className='sticky bottom-0 z-30 block w-full max-w-[500px] p-[20px] bg-white'>
        <BasicButton
          size='full'
          onClick={handleRecord}
          disabled={Object.keys(selectedFoods).length === 0}
        >
          {Object.keys(selectedFoods).length > 0
            ? `${Object.keys(selectedFoods).length}개 기록하기`
            : '기록하기'}
        </BasicButton>
      </div>
    </>
  );
}
