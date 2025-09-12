import React from 'react';
import ChartArea from '../components/ChartArea';

export default function AiReportPage({fullDate, activePeriod, setActivePeriod, prev, next, canMove}) {
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

      </ChartArea>
    </main>
  );
}
