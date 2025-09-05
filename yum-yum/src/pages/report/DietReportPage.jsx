import React, { useEffect, useState } from 'react';
import ChartArea from './ChartArea';

export default function DietReportPage() {
  const [activePeriod, setActivePeriod] = useState('일간');

  useEffect(() => {
    // console.log(activePeriod);
  }, [activePeriod]);

  return (
    <ChartArea
      date={'08.28(목)'}
      period='일간'
      unit='Kcal'
      value='768'
      activePeriod={activePeriod}
      onPeriodChange={setActivePeriod}
    ></ChartArea>
  );
}
