import React, { useEffect, useState } from 'react';
import ChartArea from './ChartArea';
import PieCharts from './charts/PieCharts';

export default function DietReportPage() {
  const [activePeriod, setActivePeriod] = useState('일간');

  useEffect(() => {
    // console.log(activePeriod);
  }, [activePeriod]);

  const data = [
  { name: '탄수화물', value: 400 },
  { name: '단백질', value: 300 },
  { name: '지방', value: 300 },
];

  return (
    <ChartArea
      date={'08.28(목)'}
      period='일간'
      unit='Kcal'
      value='768'
      activePeriod={activePeriod}
      onPeriodChange={setActivePeriod}
    >
      <PieCharts data={data}/> 
    </ChartArea>
  );
}
