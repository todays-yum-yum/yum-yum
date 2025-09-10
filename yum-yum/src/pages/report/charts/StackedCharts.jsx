import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export default function StackedCharts({data}) {

  // 상위 3개와 기타 색상 팔레트
  const PALETTES = {
    탄수화물: ['#ff5094', '#ff7ba1', '#ff96a9', '#ffb9bf'],
    단백질: ['#ffd653', '#ffe897', '#fff9dc', '#fffcf0'],
    지방: ['#2f73e5', '#7faff3', '#c8def9', '#d3e7fb'],
  };

  const colors = PALETTES[data.name] || [];

  const chartsMapping = [
    {
      label: '탄수화물',
      percent: '40%',
      value: `${data.carbs} g`,
      goal: ''
    },
    {
      label: '단백질',
      percent: '30%',
      value: `${data.protein} g`,
      goal: ''
    },
    {
      label: '지방',
      percent: '30%',
      value: `${data.fat} g`,
      goal: ''
    },
  ];

  return (
    <BarChart
      width={600}
      height={80}
      data={data}
      layout='vertical'
      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
    >
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis
        type='number'
        domain={[0, data[0].total]}
        axisLine={false} // 축 선 숨김
        tick={false} // 눈금 숨김
      />
      <YAxis type='category' dataKey='name' hide={true} />
      <Tooltip />

      {/* 음식별 스택*/}
      <Bar dataKey='rice' stackId='a' fill='#8884d8' radius={[10, 0, 0, 10]} />
      <Bar dataKey='bread' stackId='a' fill='#82ca9d' radius={[0, 0, 0, 0]} />
      <Bar dataKey='fruit' stackId='a' fill='#ffc658' radius={[0, 0, 0, 0]} />
      <Bar dataKey='snack' stackId='a' fill='#ff8042' radius={[0, 10, 10, 0]} />

      <ReferenceLine
        x={100} // 목표값 위치
        stroke='red'
        strokeWidth={2}
        strokeDasharray='4 4' // 점선
        label={{
          position: 'insideBottomRight',
          value: `목표 ${data[0].goal}`,
          fill: 'red',
          fontSize: 12,
        }}
      />
    </BarChart>
  );
}
