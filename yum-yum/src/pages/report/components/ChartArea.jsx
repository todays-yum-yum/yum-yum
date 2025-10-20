import React from 'react';
import RoundButton from '@/components/button/RoundButton';
import DateHeader from '@/components/common/DateHeader';

import PrevDateIcon from '@/assets/icons/icon-left.svg?react';
import NextDateIcon from '@/assets/icons/icon-right.svg?react';

import { roundTo1, toNum } from '@/utils/nutrientNumber';
import { parseDateString, dateFormatting } from '@/utils/dateUtils';

import { useReportStore } from '@/stores/useReportStore';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';

// 단위 기간별 접두어
const periodPrefixConfig = {
  일간: '오늘의',
  주간: '이번 주',
  월간: '이번 달',
};

// 리포트 타입별 접두어 + 접미어
const unitConfig = {
  Kcal: {
    prefix: '칼로리',
    postfix: 'kcal',
  },
  L: {
    prefix: '수분 섭취량',
    postfix: 'L',
  },
  Kg: {
    prefix: '몸무게',
    postfix: 'Kg',
  },
  AI: {
    prefix: '리포트',
    postfix: '',
  },
};

// 단위기간 버튼용
const periods = ['일간', '주간', '월간'];

export default function ChartArea({ originDate, date, unit, value, children }) {
  const {
    setDate,
    calendarOpen,
    setCalendarOpen,
    handlePrevDate,
    handleNextDate,
    getCanMove,
    activePeriod,
    setActivePeriod,
  } = useReportStore();

  // 활성화된 단위기간과 리포트 타입에 맞는 접두어 및 접미어 설정
  const periodPrefix =
    activePeriod === '일간'
      ? periodPrefixConfig[activePeriod]
      : periodPrefixConfig[activePeriod] + (unit === 'AI' || unit === 'Kg' ? '' : ' 평균');

  const unitInfo = unitConfig[unit];

  const dateFormat = (activePeriod) => {
    switch (activePeriod) {
      case '일간': {
        return 'MM월 dd일';
      }

      case '주간': {
        return '';
      }

      case '월간': {
        return 'yyyy년 MM월';
      }
    }
  };

  const aiArea = clsx(unit === 'AI' && 'h-[calc(100vh-190px)] overflow-y-auto');

  const valueNormaize = () => {
    const num = toNum(value) || 0;

    if (unit === 'Kg') {
      return num === 0 ? '-' : roundTo1(num);
    }

    if (unit === 'Kcal') {
      return Math.round(num);
    }

    return roundTo1(num);
  };

  // console.log("value", value)

  // console.log(date, originDate);

  return (
    <section
      className={clsx(
        aiArea,
        'flex flex-col items-center gap-7.5 py-5 border-t border-b border-gray-200 bg-[var(--color-primary-light)] ',
      )}
    >
      {/* 날짜 및 날짜 변경 버튼 */}
      {date && (
        <div className='flex flex-row items-center'>
          <button onClick={() => handlePrevDate(activePeriod)}>
            <PrevDateIcon />
          </button>

          {/* 날짜 표기와 캘린더 */}
          <article className='text-2xl font-bold'>
            <DateHeader
              date={activePeriod === '월간' ? parseDateString(originDate).originDate : ''}
              dateString={activePeriod !== '월간' ? date : ''}
              dateFormat={dateFormat(activePeriod)}
              showOnBoardIcon={false}
              onCalendarClick={() => {
                setCalendarOpen(!calendarOpen);
              }}
              className={'!bg-transparent'}
              textSize={'!text-2xl'}
            />
            {calendarOpen && (
              <>
                {/* 캘린더 */}
                <div className={clsx('absolute  z-10 left-1/2 -translate-x-1/2')}>
                  <DatePicker
                    dateFormat={dateFormat(activePeriod)}
                    showMonthYearPicker={activePeriod === '월간'} // 추가
                    selected={parseDateString(originDate).originDate}
                    onChange={(date) => {
                      setDate(dateFormatting(date));
                      setCalendarOpen(false); // 날짜 선택 후 닫기
                    }}
                    minDate={new Date('2000-01-01')}
                    maxDate={new Date()}
                    locale='ko'
                    inline // 인라인으로 표시
                  />
                </div>
              </>
            )}
          </article>
          {getCanMove() && (
            <button onClick={() => handleNextDate(activePeriod)} disabled={!getCanMove()}>
              <NextDateIcon />
            </button>
          )}
        </div>
      )}
      {/* 리포트 타입에 따른 값과 단위 출력 + 접두어 */}

      {unit === 'AI' && (
        <article className='flex items-end gap-2'>
          <span className='text-2xl font-bold'>
            {periodPrefix} {unitInfo.prefix}
          </span>
        </article>
      )}

      {value !== null && value !== undefined && unit !== 'AI' && (
        <article className='flex items-end gap-2'>
          <span className='text-2xl font-bold'>
            {periodPrefix} {unitInfo.prefix} :{' '}
          </span>
          <span className='text-4xl font-bold'>{valueNormaize() ?? 0}</span>
          <span className='text-2xl font-bold'> {unitInfo.postfix}</span>
        </article>
      )}

      {/* 차트를 입력할 부분 */}
      {children}

      {/* 단위 기간 버튼 */}
      <nav className='flex flex-row gap-4 py-2.5 justify-center'>
        {periods.map((period) => (
          <RoundButton
            key={period}
            onClick={() => setActivePeriod(period)}
            variant={activePeriod === period ? 'filled' : 'line'}
          >
            {period}
          </RoundButton>
        ))}
      </nav>
    </section>
  );
}
