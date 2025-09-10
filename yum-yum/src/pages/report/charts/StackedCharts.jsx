import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export default function StackedCharts({ data }) {
  // 상위 3개와 기타 색상 팔레트
  const PALETTES = {
    탄수화물: ['#ff5094', '#ff7ba1', '#ff96a9', '#ffb9bf'],
    단백질: ['#ffd653', '#ffe897', '#fff9dc', '#fffcf0'],
    지방: ['#2f73e5', '#7faff3', '#c8def9', '#d3e7fb'],
  };

  // 영양소에 따른 색상표 선택
  const colors = PALETTES[data.name] || [];

  // 총합
  const total = data.top1 + data.top2 + data.top3 + data.etc;

  // 마지막 요소 판단 함수
  const getRadius = (isFirst, isLast) => {
    if (isFirst && isLast) return [10, 10, 10, 10]; // 첫번째이면서 마지막
    if (isFirst) return [10, 0, 0, 10]; // 첫번째만
    if (isLast) return [0, 10, 10, 0]; // 마지막만
    return [0, 0, 0, 0]; // 중간
  };

  // 존재하는 요소들의 배열
  const elements = ['top1']; // top1은 항상 존재
  if (data.top2 > 0) elements.push('top2');
  if (data.top3 > 0) elements.push('top3');
  if (data.etc > 0) elements.push('etc');

  // 마지막 요소 확인
  const lastElement = elements[elements.length - 1];

  return (
    <BarChart width={400} height={40} data={[data]} layout='vertical'>
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis
        type='number'
        domain={[0, total > data.goal ? total : data.goal]}
        axisLine={false} // 축 선 숨김
        tick={false} // 눈금 숨김
        hide
      />
      <YAxis type='category' dataKey='name' hide={true} />
      {/* 음식별 스택*/}

      <Bar
        dataKey='top1'
        stackId='a'
        fill={colors[0]}
        radius={getRadius(true, lastElement === 'top1')}
        background={{ fill: '#eee', radius: [10, 10, 10, 10] }}
        isAnimationActive={false}
      />

      {data.top2 > 0 && (
        <Bar
          dataKey='top2'
          stackId='a'
          fill={colors[1]}
          radius={getRadius(false, lastElement === 'top2')}
          isAnimationActive={false}
        />
      )}

      {data.top3 > 0 && (
        <Bar
          dataKey='top3'
          stackId='a'
          fill={colors[2]}
          radius={getRadius(false, lastElement === 'top3')}
          isAnimationActive={false}
        />
      )}

      {data.etc > 0 && (
        <Bar
          dataKey='etc'
          stackId='a'
          fill={colors[3]}
          radius={getRadius(false, lastElement === 'etc')}
          isAnimationActive={false}
        />
      )}

      <ReferenceLine
        x={data.goal} // 목표값 위치
        stroke='red'
        strokeWidth={2}
        strokeDasharray='4 4' // 점선
        label={{
          position: 'insideBottomRight',
          value: `목표 ${data.goal}`,
          fill: 'red',
          fontSize: 12,
        }}
      />
    </BarChart>
  );
}
