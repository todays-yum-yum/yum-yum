import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
//훅
import { useCustomFoods } from '@/hooks/useCustomFoods';
// 유틸
import { callUserUid } from '@/utils/localStorage';
// 컴포넌트
import EmptyState from '@/components/EmptyState';
import FoodList from '../component/FoodList';
// 아이콘
import SearchIcon from '@/assets/icons/icon-search.svg?react';
import ConfirmModal from '../../../components/modal/ConfirmModal';

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
      await toast.promise(deleteFoodMutation.mutateAsync(targetFoodId), {
        loading: '삭제 중...',
        success: '삭제 되었습니다!',
        error: '삭제 실패',
      });
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
        <div className='flex justify-between items-center px-5 py-3 bg-gray-50'>
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

        {foodItems.length > 0 && (
          <div className='sticky top-[118px] flex items-center justify-between pt-4 px-5 bg-white'>
            <h4 className='font-extrabold'>{isEditing ? '직접 등록 편집' : '직접 등록'}</h4>
            <button onClick={handleToggleEdit} className='text-gray-500'>
              {isEditing ? '완료' : '편집'}
            </button>
          </div>
        )}
      </div>

      <div className='flex flex-col min-h-[calc(100vh-266px)]'>
        <div className='flex-1 px-[20px]'>
          {foodItems.length > 0 ? (
            <FoodList
              variant={isEditing ? 'delete' : 'select'}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              onRemove={isEditing ? handleDeleteCustom : undefined}
              items={foodItems}
            />
          ) : (
            <EmptyState className='min-h-[calc(100vh-266px)]'>등록한 음식이 없어요</EmptyState>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpenModal={confirmOpen}
        s
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
