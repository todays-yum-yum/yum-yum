import React from 'react';
import ChartArea from '../components/ChartArea';

import LightBulbIcon from '@/assets/icons/icon-light-bulb.svg?react';

export default function AiReportPage({
  fullDate,
  activePeriod,
  setActivePeriod,
  prev,
  next,
  canMove,
}) {
  const onPrevPeriod = () => {
    prev();
  };

  const onNextPeriod = () => {
    next();
  };

  return (
    <main className='flex flex-col gap-7.5'>
      <ChartArea
        date={fullDate}
        period='일간'
        unit='AI'
        value='1.2'
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        <section className='flex flex-col gap-2.5 w-90 pt-5 pb-5 pr-5 pl-5 rounded-2xl text-white bg-[var(--color-primary)] text-center'>
          <article className='flex flex-row items-center justify-center text-lg'><LightBulbIcon /> AI 코치의 조언</article>
          <article className='text-xl'>주간 탄수화물이 다소 많습니다. 밥·빵 섭취를 줄여 보세요.</article>
        </section>
      </ChartArea>
    </main>
  );
}
