import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';

export default function PieCharts({ data = [] }) {
  const PALETTES = ['#FF5094', '#2F73E5', '#FFD653', '#FF8042'];

  // 데이터 가공. 입력된 데이터가 없을 땐 0으로 처리
  const chartData =
    data.length > 0
      ? data
      : [
          { name: '탄수화물', value: 0 },
          { name: '단백질', value: 0 },
          { name: '지방', value: 0 },
        ];

  // 합계 계산
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  // 파이 차트에 사용할 데이터. 데이터가 없을 때 따로 처리
  const pieData =
    total === 0
      ? chartData.map((d) => ({ ...d, value: 1 })) // 0일 땐 균등하게 1씩
      : chartData;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
  }) => {
    // 각도 라디안 계산
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // 안쪽 절반 지점
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill='white' textAnchor='middle' dominantBaseline='central' fontSize={16} fontWeight={400}>
        {total === 0 ? '0%' : `${(percent * 100).toFixed(0)}%`}
      </text>
      // 값이 없을때 0% 표기
    );
  };

  return (
    <PieChart width={400} height={330}>
      <Pie
        data={pieData}
        cx='50%'
        cy='45%'
        labelLine={false}
        outerRadius={120}
        dataKey='value'
        label={renderCustomizedLabel} // 커스텀 라벨 적용
        isAnimationActive={false} // 애니메이션 설정
      >
        {/* 차트 색상은 미리 지정한 색상 */}
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={PALETTES[index % PALETTES.length]} />
        ))}
      </Pie>

      <Legend
        layout='horizontal'
        verticalAlign='bottom'
        align='center'
        // 범례
        payload={pieData.map((item, index) => ({
          value: item.name,
          type: 'square', // 범례 도형
        }))}
        wrapperStyle={{
          whiteSpace: 'nowrap', // 줄바꿈 방지
          marginTop: 20,
          fontSize: 18,
          fontWeight: 700,
        }}
        formatter={(value) => {
          const item = chartData.find((d) => d.name === value);
          return (
            // 범례 값 출력 2줄로 출력하도록
            <div className='inline-block text-center w-20 align-middle text-black'>
              <div>{value}</div>
              <div className='mt-1'>{item?.value ?? 0}g</div>
            </div>
          );
        }}
      />
    </PieChart>
  );
}
