import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// 스토어
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 컴포넌트
import MealHeader from './component/MealHeader';
import MealTabs from './component/MealTabs';
import BasicButton from '@/components/button/BasicButton';
import FrequentlyEatenFood from './page/FrequentlyEatenFood';
import CustomEntry from './page/CustomEntry';

const tabItem = [
  { id: 'frequent', label: '최근 먹은 음식' },
  { id: 'custom', label: '직접 등록' },
];

export default function MealPage() {
  const { activeTab, setActiveTab, selectedFoods, clearFoods } = useSelectedFoodsStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { type } = useParams();
  const [searchInputValue, setSearchInputValue] = useState('');
  const date = location.state?.date;

  // 페이지 진입 시 선택항목 초기화
  useEffect(() => {
    if (location.state?.formMain) {
      clearFoods();
      setActiveTab('frequent');
    }
  }, [location.state, clearFoods, setActiveTab]);

  const onSearchChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  // 돋보기 아이콘 클릭, 엔터
  const handleSearchSubmit = () => {
    // console.log(searchInputValue);
    // FoodSearchResult.jsx 페이지로 이동
    navigate(`/meal/search`, {
      state: { searchInputValue, type, date },
      replace: false, // 히스토리에 추가해서 뒤로가기 가능
    });
  };

  // 기록하기 버튼
  const handleRecord = () => {
    navigate(`/meal/${type}/total`, {
      state: { date },
    });
  };

  return (
    <div>
      <MealHeader
        variant='search'
        value={searchInputValue}
        onChange={onSearchChange}
        handleSearchSubmit={handleSearchSubmit}
      />

      <MealTabs activeTabId={activeTab} onChange={setActiveTab} tabItem={tabItem} />
      <div className={activeTab === 'frequent' ? 'block' : 'hidden'}>
        <FrequentlyEatenFood />
      </div>
      <div className={activeTab === 'custom' ? 'block' : 'hidden'}>
        <CustomEntry />
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
    </div>
  );
}
