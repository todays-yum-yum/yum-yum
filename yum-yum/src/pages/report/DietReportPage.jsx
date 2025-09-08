import React, { useEffect, useState } from 'react';
import ChartArea from './ChartArea';
import PieCharts from './charts/PieCharts';
import { getDayOfWeekShort, todayDate } from '../../utils/dateUtils';

export default function DietReportPage() {
  const [activePeriod, setActivePeriod] = useState('일간');
  const [date, setDate] = useState(todayDate());
  const day = getDayOfWeekShort(date);
  const fullDate = date + ' (' + day + ')';

  useEffect(() => {
    if (activePeriod === '일간') {
      console.log('일간');
    }

    if (activePeriod === '주간') {
      console.log('주간');
    }

    if (activePeriod === '월간') {
      console.log('월간');
    }
  }, [activePeriod]);

  const data = [
    { name: '탄수화물', value: 400 },
    { name: '단백질', value: 300 },
    { name: '지방', value: 300 },
  ];

  return (
    <ChartArea
      date={fullDate}
      period='일간'
      unit='Kcal'
      value='768'
      activePeriod={activePeriod}
      onPeriodChange={setActivePeriod}
    >
      <PieCharts data={data} />
    </ChartArea>
  );
}
