import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
//훅
import { useCustomFoods } from '@/hooks/useCustomFoods';
// 유틸
import { callUserUid } from '@/utils/localStorage';
// 컴포넌트
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';
import ConfirmModal from '@/components/modal/ConfirmModal';
import SearchBar from '../component/SearchBar';
import RoundButton from '@/components/button/RoundButton';

export default function CustomEntry({ selectedIds, onToggleSelect }) {
  const userId = callUserUid(); // 로그인한 유저 uid 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const { type } = useParams();
  const date = location.state?.date;
  const { foodItems, deleteFoodMutation } = useCustomFoods(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetFoodId, setTargetFoodId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 실시간 필터링 - 검색어에 따른 음식 목록 필터링
  const filteredFoodItems = useMemo(() => {
    if (!searchQuery.trim()) return foodItems;

    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return foodItems.filter((food) => regex.test(food.foodName));
  }, [foodItems, searchQuery]);

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 직접 등록 폼으로 이동
  const handleCustomEntry = () => {
    navigate('/meal/custom', {
      state: { date, type },
    });
  };

  // 편집 토글
  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // 삭제 아이콘 클릭 시
  const handleDeleteCustom = (foodId) => {
    setTargetFoodId(foodId);
    setConfirmOpen(true);
  };

  // 컨펌창에서 삭제 버튼 눌렀을떄
  const handleConfirmDelete = async () => {
    if (!targetFoodId) return;

    try {
      await deleteFoodMutation.mutateAsync(targetFoodId);
    } catch (error) {
      console.error('직접 등록 실패', error);
    } finally {
      setConfirmOpen(false);
      setTargetFoodId(null);
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='sticky top-[118px] z-30'>
        {/* 직접 등록 버튼 */}
        <div className='flex justify-between items-center gap-[20px] px-5 py-3 bg-gray-50'>
          {foodItems.length > 0 ? (
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='등록한 음식을 검색해보세요.'
              className='flex-1'
            />
          ) : (
            <p className='text-sm text-gray-500 font-bold'>
              찾는 음식이 없나요? 직접 등록해보세요.
            </p>
          )}

          <RoundButton color='secondary' onClick={handleCustomEntry}>
            직접 등록
          </RoundButton>
        </div>

        {foodItems.length > 0 && filteredFoodItems.length > 0 && (
          <div className='sticky top-[118px] flex items-center justify-between pt-4 px-5 bg-white'>
            <h4 className='font-extrabold'>{isEditing ? '직접 등록 편집' : '직접 등록'}</h4>
            <button onClick={handleToggleEdit} className='text-gray-500'>
              {isEditing ? '완료' : '편집'}
            </button>
          </div>
        )}
      </div>

      <div className='flex flex-col min-h-[calc(100vh-318px)]'>
        <div className='flex-1 px-[20px]'>
          {foodItems.length === 0 ? (
            <EmptyState className='min-h-[calc(100vh-278px)]'>등록한 음식이 없어요</EmptyState>
          ) : filteredFoodItems.length === 0 ? (
            <EmptyState className='min-h-[calc(100vh-278px)]'>검색 결과가 없어요</EmptyState>
          ) : (
            <FoodList
              variant={isEditing ? 'delete' : 'select'}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              onRemove={isEditing ? handleDeleteCustom : undefined}
              items={filteredFoodItems}
            />
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpenModal={confirmOpen}
        onCloseModal={() => setConfirmOpen(false)}
        title='음식을 삭제하시겠어요?'
        desc='리스트에서 삭제됩니다.'
        leftBtnLabel='취소'
        RightBtnLabel='삭제'
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
