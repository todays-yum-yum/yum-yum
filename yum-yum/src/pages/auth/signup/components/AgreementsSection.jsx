import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// 컴포넌트
import AgreementItem from './AgreementItem';
import AgreementModal from './AgreementModal';

export default function AgreementsSection() {
  const [openModal, setOpenModal] = useState(null);
  const { control, setValue, watch } = useFormContext();
  const service = watch('service');
  const privacy = watch('privacy');
  const sensitive = watch('sensitive');

  // 전체 동의 체크박스
  const handleAllChange = (checked) => {
    setValue('service', checked);
    setValue('privacy', checked);
    setValue('sensitive', checked);
  };

  return (
    <div className='p-[20px]'>
      <div className=' p-[20px]'>
        <Controller
          name='agreeAll'
          control={control}
          rules={{
            validate: () => (service && privacy && sensitive) || '필수 약관에 모두 동의해주세요.',
          }}
          render={({ field }) => (
            <AgreementItem
              {...field}
              id='agreeAll'
              label='약관 전체 동의'
              checked={service && privacy && sensitive}
              onChange={handleAllChange}
              isAll
            />
          )}
        />

        <div className='flex flex-col gap-[20px]'>
          <Controller
            name='service'
            control={control}
            render={({ field }) => (
              <AgreementItem
                {...field}
                id='service'
                checked={service}
                label='[필수] 서비스 이용약관 동의'
                isNext
                type='service'
                onOpenModal={setOpenModal}
              />
            )}
          />

          <Controller
            name='privacy'
            control={control}
            render={({ field }) => (
              <AgreementItem
                {...field}
                id='privacy'
                checked={privacy}
                label='[필수] 개인정보 수집 및 이용 동의'
                isNext
                type='privacy'
                onOpenModal={setOpenModal}
              />
            )}
          />

          <Controller
            name='sensitive'
            control={control}
            render={({ field }) => (
              <AgreementItem
                {...field}
                id='sensitive'
                checked={sensitive}
                label='[필수] 민감정보 수집 및 이용 동의'
                isNext
                type='sensitive'
                onOpenModal={setOpenModal}
              />
            )}
          />
        </div>
      </div>

      {/* 에러 메세지 */}
      <Controller
        name='agreeAll'
        control={control}
        render={({ fieldState }) =>
          fieldState.error && (
            <p className='text-[var(--color-error)] text-sm px-[20px]'>
              {fieldState.error.message}
            </p>
          )
        }
      />

      {/* 약관 자세히 보기 모달 */}
      {openModal && (
        <AgreementModal
          isOpenModal={!!openModal}
          onCloseModal={() => setOpenModal(null)}
          type={openModal}
        />
      )}
    </div>
  );
}
