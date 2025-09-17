import React from 'react';
import ChartArea from '../components/ChartArea';
import LineCharts from '../charts/LineCharts';
import WaterWeightInfo from '../components/WaterWeightInfo';

export default function WeightReportPage({
  originDate,
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
        unit='Kg'
        value='60'
        activePeriod={activePeriod}
        prevDate={onPrevPeriod}
        nextDate={onNextPeriod}
        canMove={canMove}
        onPeriodChange={setActivePeriod}
      >
        <LineCharts />
      </ChartArea>
      <section>
        <WaterWeightInfo period={activePeriod} date={fullDate} unit='Kg' />
      </section>
    </main>
  );
}
