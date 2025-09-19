import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeStore } from '../../stores/useHomeStore';
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';

const menuItems = [
  { id: '1', name: '아침', key: 'breakfast' },
  { id: '2', name: '점심', key: 'lunch' },
  { id: '3', name: '저녁', key: 'dinner' },
  { id: '4', name: '기타', key: 'snack' },
];

export default function MenuModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { selectedDate, originalMealData } = useHomeStore();
  const { clearFoods, addFood } = useSelectedFoodsStore();

  // 모달 호출 시 스크롤 막기
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  if (!isOpen) return null;

  // 모달 호출 시 스크롤 막기
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  if (!isOpen) return null;

  const menuSelected = (item) => {
    // mealdata에 데이터 필터링 => addFood에 입력
    clearFoods();
    const copy = originalMealData?.[item.key];
    copy?.map((meal) => addFood(meal));
    // 선택 값 => 식단 total 이동
    navigate(`/meal/${item.key}/total`, {
      state: { date: selectedDate, formMain: true },
    });
    // 창 닫기
    onClose;
  };
  return (
    // dark overlay 수정, 모달 하단 정렬
    <>
      <div
        onClick={onClose}
        className='fixed z-40 left-1/2 bottom-0 -translate-x-1/2 w-full max-w-[500px] h-full bg-black opacity-60'
      ></div>

      <div className='fixed z-50 left-1/2 bottom-0 -translate-x-1/2 flex flex-col w-full max-w-[500px] bg-white rounded-t-3xl p-5'>
        <ul className='text-center space-y-2'>
          <li className=' text-gray-500 p-2 border-b border-gray-300'>선택해주세요</li>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className='p-2 border-b border-gray-300 text-primary font-semibold cursor-pointer'
              onClick={() => {
                menuSelected(item);
              }}
            >
              {item.name}
            </li>
          ))}
          <li className='p-2 text-error font-semibold cursor-pointer' onClick={onClose}>
            취소
          </li>
        </ul>
      </div>
    </>
  );
}
