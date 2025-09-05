import React from 'react';
import RoundButton from '@/components/button/RoundButton';

const periodPrefixConfig = {
  일간: '오늘의',
  주간: '이번 주 평균',
  월간: '이번 달 평균',
};

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

const periods = ['일간', '주간', '월간'];

export default function ChartArea({ date, unit, value, children, activePeriod, onPeriodChange }) {
  const periodPrefix = periodPrefixConfig[activePeriod];
  const unitInfo = unitConfig[unit];

  return (
    <section className='flex flex-col items-center gap-7.5 py-5 border-t border-b border-gray-200 bg-[var(--color-primary-light)]'>
      {date && <article className='text-2xl font-bold'>{date}</article>}
      {value && (
        <article className='flex items-center gap-2'>
          <span className='text-2xl font-bold'>
            {periodPrefix} {unitInfo.prefix} :{' '}
          </span>
          <span className='text-4xl font-bold'>{value}</span>
          <span className='text-2xl font-bold'> {unitInfo.postfix}</span>
        </article>
      )}

      {children}

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
