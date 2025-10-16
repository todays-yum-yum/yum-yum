import React from 'react';

export default function MyPageCSItem({ label, type, setOpenModal, onItemClick }) {
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    } else if (setOpenModal && type) {
      setOpenModal(type);
    } else if (setOpenModal) {
      setOpenModal(true);
    } else {
      console.warn('error');
    }
  };

  return (
    <div>
      <span role='button' className='text-base text-gray-500 cursor-pointer' onClick={handleClick}>
        {label}
      </span>
    </div>
  );
}
