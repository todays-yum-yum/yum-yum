import React, { useState } from 'react';
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 컴포넌트
import FoodItem from './FoodItem';
import FoodDetailModal from './FoodDetailModal';

export default function FoodList({ items = [], variant }) {
  const { isFoodSelected, addFood, deleteFood } = useSelectedFoodsStore();
  const [openModal, setOpenModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  // 모달 열기
  const handleOpenModal = (food) => {
    setSelectedFood(food);
    setOpenModal(true);
  };

  // 음식 추가
  const handleSelectFood = (food) => {
    addFood(food);
  };

  // 음식 제거
  const handleRemoveFood = (id) => {
    deleteFood(id);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFood(null);
  };

  return (
    <div>
      <ul>
        {items.map((food) => (
          <FoodItem
            key={food.id}
            {...food}
            variant={variant}
            selected={isFoodSelected(food.id)}
            onSelect={() => handleSelectFood(food)}
            onRemove={() => handleRemoveFood(food.id)}
            onOpenModal={() => handleOpenModal(food)}
          />
        ))}
      </ul>

      {openModal && (
        <FoodDetailModal
          openModal={openModal}
          closeModal={handleCloseModal}
          foodInfo={selectedFood}
          onAddFood={handleSelectFood}
        />
      )}
    </div>
  );
}
