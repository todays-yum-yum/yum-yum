import React from 'react';
// 컴포넌트
import Modal from '@/components/Modal';
export default function FoodDetailModal({ openModal, closeModal, foodInfo }) {
  const title = foodInfo?.foodName;

  return (
    <Modal isOpenModal={openModal} onCloseModal={closeModal} title={title} btnLabel='추가하기'>
      <div>
        <div className='py-[20px] border-t border-gray-200'>
          <div className='flex justify-between text-sm'>
            <h5>탄수화물</h5>
            <p className='font-bold'>10.2g</p>
          </div>

          <div className='flex flex-col gap-[12px] pt-[20px]'>
            <div className='flex justify-between pl-[20px] text-sm text-gray-500'>
              <h6>- 당</h6>
              <p className='font-bold'>10.2g</p>
            </div>
            <div className='flex justify-between pl-[20px] text-sm text-gray-500'>
              <h6>- 당</h6>
              <p className='font-bold'>10.2g</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
