// 음식 검색 시, 검색 결과 확인 화면
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// 스토어
import { useSearchFoodStore } from '@/stores/useSearchFoodStore';
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 훅
import { useSearchFoodData } from '@/hooks/useSearchFoodData';
// 컴포넌트
import BasicButton from '@/components/button/BasicButton';
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';
import MealHeader from '../component/MealHeader';
import FoodListSkeleton from '@/components/skeleton/FoodListSkeleton';

export default function FoodSearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchItem = location.state?.searchInputValue; // 검색하는 음식 이름
  const type = location.state?.type; // 추가 타입
  const date = location.state?.date; // 추가 타입
  const { searchFoodResults: foodItems, setSearchFoodResults } = useSearchFoodStore();
  const { selectedFoods } = useSelectedFoodsStore();
  const { searchData, isLoading, isError } = useSearchFoodData(searchItem);
  const [searchInputValue, setSearchInputValue] = useState(searchItem || '');

  // 음식 검색
  useEffect(() => {
    if (searchData) {
      setSearchFoodResults(searchData);
    }
  }, [searchData]);

  // 헤더 입력값
  const onSearchChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  // 돋보기 아이콘 클릭, 엔터
  const handleSearchSubmit = () => {
    // 같은 페이지로 navigate하되 검색어를 새로 전달
    navigate(`/meal/search`, {
      state: { searchInputValue: searchInputValue, type: type, date: date },
      replace: false,
    });
  };

  // 직접 등록 버튼
  const handleCustomEntry = () => {
    navigate(`/meal/custom`, {
      state: { type, date },
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
        <div className='flex flex-col min-h-[calc(100vh-148px)]'>
          <div className='flex-1 px-[20px]'>
            {isError ? (
              // API 에러
              <EmptyState className='min-h-[calc(100vh-148px)] text-center'>
                국가정보자원관리원 화재로 인하여 <br />
                장애 복구 시까지 음식 정보를 불러올 수 없어요.
              </EmptyState>
            ) : isLoading ? (
              // 로딩 중
              <FoodListSkeleton />
            ) : foodItems?.length > 0 ? (
              // 결과 있음
              <FoodList variant='select' items={foodItems} />
            ) : (
              // 결과 없음
              <EmptyState
                className='min-h-[calc(100vh-148px)]'
                btn='직접 등록'
                btnClick={handleCustomEntry}
              >
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
