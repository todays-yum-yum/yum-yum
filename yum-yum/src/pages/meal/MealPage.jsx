import React, { useState } from 'react';
// 컴포넌트
import MealHeader from './component/MealHeader';
import MealTabs from './component/MealTabs';
import FrequentlyEatenFood from './page/FrequentlyEatenFood';
import CustomEntry from './page/CustomEntry';
import BasicButton from '@/components/button/BasicButton';
import { useNavigate } from 'react-router-dom';

const tabItem = [
  { id: 'frequent', label: '자주 먹은 음식' },
  { id: 'custom', label: '직접 등록' },
];
export default function MealPage() {
  const [activeTab, setActiveTab] = useState('frequent');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchFood, setSearchFood] = useState('');
  const navigate = useNavigate();

  const onSearchChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  // 돋보기 아이콘 클릭, 엔터
  const handleSearchSubmit = () => {
    console.log(searchInputValue);
  };

  // 기록하기 버튼
  const handleRecord = () => {
    navigate('/meal/total');
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
      {activeTab === 'frequent' ? <FrequentlyEatenFood /> : <CustomEntry />}

      <div className='sticky bottom-0 z-30 block w-full max-w-[500px] p-[20px] bg-white'>
        <BasicButton size='full' onClick={handleRecord}>
          기록하기
        </BasicButton>
      </div>
    </div>
  );
}

// pages/Meal/MealPage.jsx
// import React, { useState } from 'react';
// import { fetchMfds } from '../../services/mfds';
// import MealHeader from './component/MealHeader';
// import SearchList from './page/SearchList';
// import { useNavigate } from 'react-router-dom';

// export default function MealPage() {
//   const [searchInputValue, setSearchInputValue] = useState('');
//   const [items, setItems] = useState([]); // ✅ 결과 상태
//   const [loading, setLoading] = useState(false);
//   const [errMsg, setErrMsg] = useState('');
//   const navigate = useNavigate();

//   const onSearchChange = (e) => setSearchInputValue(e.target.value);

//   const handleSearchSubmit = async () => {
//     const q = searchInputValue.trim();
//     if (!q) return;
//     setLoading(true);
//     setErrMsg('');
//     try {
//       const data = await fetchMfds(q); // ✅ 검색어 전달
//       setItems(data); // ✅ 결과 반영
//       console.log('[MealPage] items=', data.length);
//     } catch (e) {
//       console.error(e);
//       setErrMsg(e?.message || '요청 실패');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRecord = () => navigate('/meal/total');

//   return (
//     <div>
//       <MealHeader
//         variant='search'
//         value={searchInputValue}
//         onChange={onSearchChange}
//         handleSearchSubmit={handleSearchSubmit}
//       />

//       {loading && <div className='px-[20px] text-gray-600'>불러오는 중…</div>}
//       {errMsg && <div className='px-[20px] text-red-600'>에러: {errMsg}</div>}

//       {/* ✅ 결과 내려주기 */}
//       <SearchList items={items} />
//     </div>
//   );
// }
