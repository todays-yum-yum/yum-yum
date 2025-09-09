import React, { useState } from 'react';
// 컴포넌트
import FoodItem from './FoodItem';
import FoodDetailModal from './FoodDetailModal';

export default function FoodList({
  items = [],
  variant = 'select',
  selectedIds = [],
  onToggleSelect,
  onDelete,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const isSelected = (id) => selectedIds.includes(id);

  const open = (food) => {
    setSelectedFood(food);
    setOpenModal(true);
  };

  return (
    <div>
      <ul>
        {items.map((food) => (
          <FoodItem
            key={food.id}
            id={food.id}
            foodName={food.foodName}
            makerName={food.makerName}
            foodWeight={food.foodWeight}
            foodCal={food.foodCal}
            onClick={() => open(food)}
            variant={variant}
            selected={variant === 'select' ? isSelected(food.id) : false}
            onToggleSelect={onToggleSelect ? () => onToggleSelect(food.id) : undefined}
            onDelete={onDelete ? () => onDelete(food.id) : undefined}
          />
        ))}
      </ul>
      <FoodDetailModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        foodInfo={selectedFood}
      />
    </div>
  );
}
