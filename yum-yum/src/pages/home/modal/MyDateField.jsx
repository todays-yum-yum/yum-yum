import React, { useRef } from 'react';
import { useOnClickOutside } from '../../../hooks/useWeight';
import DatePicker, { registerLocale } from 'react-datepicker';
import DateSelector from '../../../components/common/DateSelector';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

registerLocale('ko', ko);

export default function MyDateField({
  register,
  errors,
  selectedDateModal,
  setSelectedDateModal,
  selectedDateModalOpen,
  setSelectedDateModalOpen,
}) {
  const wrapperRef = useRef(null);

  // wrapper 바깥을 클릭하면 달력 닫기
  useOnClickOutside(wrapperRef, () => {
    setSelectedDateModalOpen(false);
  });

  return (
    <div className='flex justify-center mt-4 mb-2 gap-2 items-end'>
      <DateSelector
        onCalendarClick={() => setSelectedDateModalOpen(!selectedDateModalOpen)}
        formattedDate={format(selectedDateModal, 'yyyy년 MM월 dd일', { locale: ko })}
      />
      {selectedDateModalOpen && (
        <div className='absolute z-20 mt-2' ref={wrapperRef}>
          <DatePicker
            dateFormat='yyyy.MM.dd'
            selected={selectedDateModal}
            onChange={(date) => {
              setSelectedDateModal(date);
              setSelectedDateModalOpen(false); // 날짜 선택 후 닫기
            }}
            minDate={new Date('2000-01-01')}
            maxDate={new Date()}
            locale='ko'
            inline // 인라인으로 표시
          />
        </div>
      )}
      {/* 숨겨진 input으로 form에 등록 */}
      <input
        type='hidden'
        {...register('date', { required: '날짜를 입력해주세요' })}
        value={format(selectedDateModal, 'yyyy-MM-dd')}
      />
    </div>
  );
}
