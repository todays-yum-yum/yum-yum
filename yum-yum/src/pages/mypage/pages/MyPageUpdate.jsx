import React from 'react';
// 컴포넌트
import ProfileList from '../component/edit/ProfileList';
import Modal from '@/components/Modal';
import NumberInput from '@/components/common/NumberInput';
// 아이디 호출
import { callUserUid } from '@/utils/localStorage';
// 커스텀 훅
import { useUserSettings } from '@/hooks/useUserSettings';

export default function MyPageUpdate() {
  // 유저 id 불러오기
  const userId = callUserUid();
  const {
    userSettings: profileData,
    currentItem,
    isModalOpen,
    tempValue,
    handleSettingClick,
    handleModalClose,
    register,
    handleSubmit,
    reset,
    formState,
  } = useUserSettings(userId);

  // Modal children 렌더링 함수
  const renderModalContent = () => {
    if (!currentItem) return null;
    const { id, type, options, unit, min, max } = currentItem;

    if (type === 'number') {
      return (
        <NumberInput
          unit={unit}
          min={min}
          max={max}
          register={register}
          name={id}
          errors={formState.errors}
        />
      );
    }
  };

  return (
    <div className='flex flex-col gap-8 justify-start item-center w-full h-full '>
      {/* 타이틀 */}
      <div className='text-center mt-12 mb-8'>
        <h1 className='text-[28px] font-bold'>기본 정보를</h1>
        <h1 className='text-[28px] font-bold'>먼저 확인해 주세요</h1>
      </div>
      {/* 기본정보 나열 카드 */}
      <div className='w-full h-full px-4 flex flex-col justify-start gap-8 mb-8'>
        <ProfileList profileData={profileData} onItemClick={handleSettingClick} />
      </div>
      {/* 모달 오픈 */}
      <Modal
        isOpenModal={isModalOpen}
        onCloseModal={handleModalClose}
        title={currentItem?.label || ''}
        btnLabel='수정'
        showClose={true}
        onBtnClick={handleSubmit}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}
