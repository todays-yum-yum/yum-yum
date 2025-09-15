// 음식 검색 시, 검색 결과 확인 화면
import React, { useEffect, useState } from 'react';
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';
import MealHeader from '../component/MealHeader';
import { useSearchFoodStore } from '../../../stores/useSearchFoodStore';
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
import { fetchNutritionData } from '../../../services/searchFoodApi';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FoodSearchResultsPage() {
  const location = useLocation();
  const searchItem = location.state?.searchInputValue; // 검색하는 음식 이름
  const { searchFoodResults: foodItems, setSearchFoodResults } = useSearchFoodStore();
  const { activeTab, setActiveTab, selectedFoods, clearFoods } = useSelectedFoodsStore();

  const [searchInputValue, setSearchInputValue] = useState(searchItem || '');
  const navigate = useNavigate();

  // 음식 검색
  useEffect(() => {
    // 검색 로직 추가
    if (searchItem) {
      console.log('검색 실행:', searchItem);
      searchFood(searchItem);
    }
  }, [searchItem]);

  // 헤더 입력값
  const onSearchChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  // 돋보기 아이콘 클릭, 엔터
  const handleSearchSubmit = () => {
    console.log(searchInputValue);
    // 같은 페이지로 navigate하되 검색어를 새로 전달
    navigate(`/meal/search`, {
      state: { searchInputValue: searchInputValue },
      replace: false,
    });
  };

  // 사용 예시
  const searchFood = async (searchItem) => {
    const foods = await fetchNutritionData(searchItem);
    console.log('파싱된 음식 데이터:', foods);
    setSearchFoodResults(foods);
  };

  const handleToggleSelect = () => {
    console.log('handleToggleSelect click');
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
    </>
  );
}
