import React from 'react';
import RoundButton from '@/components/button/RoundButton';
import PrevDateIcon from '@/assets/icons/icon-left.svg?react';
import NextDateIcon from '@/assets/icons/icon-right.svg?react';

// 단위 기간별 접두어
const periodPrefixConfig = {
  일간: '오늘의',
  주간: '이번 주 평균',
  월간: '이번 달 평균',
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
};

// 단위기간 버튼용
const periods = ['일간', '주간', '월간'];

export default function ChartArea({ date, unit, value, children, activePeriod, onPeriodChange,
  prevDate, nextDate  }) {
  // 활성화된 단위기간과 리포트 타입에 맞는 접두어 및 접미어 설정
  const periodPrefix = periodPrefixConfig[activePeriod];
  const unitInfo = unitConfig[unit];

  return (
    <section className='flex flex-col items-center gap-7.5 py-5 border-t border-b border-gray-200 bg-[var(--color-primary-light)]'>
      {/* 날짜 및 날짜 변경 버튼 */}
      {date && (
        <div className='flex flex-row gap-5 items-center'>
          <button onClick={prevDate}>
            <PrevDateIcon />
          </button>

          <article className='text-2xl font-bold'>{date}</article>
          <button onClick={nextDate}>
            <NextDateIcon />
          </button>
        </div>
      )}
      {/* 리포트 타입에 따른 값과 단위 출력 + 접두어 */}
      {value && (
        <article className='flex items-end gap-2'>
          <span className='text-2xl font-bold'>
            {periodPrefix} {unitInfo.prefix} :{' '}
          </span>
          <span className='text-4xl font-bold'>{value}</span>
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
            onClick={() => onPeriodChange(period)}
            variant={activePeriod === period ? 'filled' : 'line'}
          >
            {period}
          </RoundButton>
        ))}
      </nav>
    </section>
  );
}
