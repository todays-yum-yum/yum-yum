/**
 TODO: 화면 우선 제작
 */
import React, { useState } from 'react';
import DateHeader from '@/components/common/DateHeader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import OnBoarding from '../../components/common/OnBoarding';

registerLocale('ko', ko);

export default function HomePage() {
  const [date, setDate] = useState(new Date());
  const [calendarOepn, setCalendarOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);

  return (
    <div className='flex flex-row gap-8 justify-center item-center bg-primary-light w-full h-full min-h-screen'>
      {/* 최상단 날짜 */}
      <div className=' w-full h-full'>
        <DateHeader
          date={date}
          onCalendarClick={() => {
            setCalendarOpen(!calendarOepn);
          }}
          onOnBoardClick={() => {
            setOnboardOpen(true);
          }}
        />
        {calendarOepn && (
          <div className='absolute z-10 mt-2 left-[120px]'>
            {/* 래퍼 div 추가 */}
            <DatePicker
              dateFormat='yyyy.MM.dd'
              selected={date}
              onChange={(date) => {
                setDate(date);
                setCalendarOpen(false); // 날짜 선택 후 닫기
              }}
              minDate={new Date('2000-01-01')}
              maxDate={new Date()}
              locale='ko'
              inline // 인라인으로 표시
            />
          </div>
        )}
      </div>
      {/* OnBoarding 컴포넌트 */}
      <OnBoarding isOpen={onboardOpen} onClose={() => setOnboardOpen(false)} />
      {/* 실시간 칼로리 카드 */}

      {/* 체중 정보 카드 */}

      {/* 실시간 식단 표 */}
    </div>
  );
}
