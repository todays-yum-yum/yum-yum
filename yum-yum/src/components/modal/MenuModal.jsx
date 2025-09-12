// 식사 type 선택 후, 값 어떻게 넘겨야하는지?
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeStore } from '../../stores/useHomeStore';

const menuItems = [
  { id: '1', name: '아침', key: 'breakfast' },
  { id: '2', name: '점심', key: 'lunch' },
  { id: '3', name: '저녁', key: 'dinner' },
  { id: '4', name: '기타', key: 'snack' },
];

export default function MenuModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const { selectedDate } = useHomeStore();

  const menuSelected = (item) => {
    // 선택 값 => 식단 입력 이동
    // console.log('item: ', item.name);
    navigate(`/meal/${item.key}`, {
      state: { date: selectedDate, formMain: true },
    });
    // 창 닫기
    onClose;
  };
  return (
    // dark overlay 수정, 모달 하단 정렬
    <div className='fixed inset-0 bg-black/30 flex justify-center items-end z-50 '>
      <div className='bg-white rounded-lg p-4 w-full opacity-100'>
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
    </div>
  );
}
