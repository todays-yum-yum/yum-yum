import React from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '영양소', carbs: 56, protein: 11, fat: 33 }, // 퍼센트 단위
];
export default function TotalBarChart({ carbs = 27.8, protein = 5.7, fat = 7.2 }) {
  const colors = { carbs: '#FF5094', protein: '#FFD653', fat: '#2F73E5' };

  function LegendItem({ color, text }) {
    return (
      <div className='flex items-center gap-2'>
        <span
          style={{
            width: 8,
            height: 8,
            background: color,
            borderRadius: 999,
          }}
        />
        <span className='text-gray-800 font-semibold'>{text}</span>
      </div>
    );
  }
  const renderLegend = () => (
    <div className='flex items-center justify-center gap-4 mt-[20px] text-sm'>
      <LegendItem color={colors.carbs} text={`탄 ${carbs}g`} />
      <LegendItem color={colors.protein} text={`단 ${protein}g`} />
      <LegendItem color={colors.fat} text={`지 ${fat}g`} />
    </div>
  );

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart layout='vertical' data={data}>
        <XAxis type='number' domain={[0, 100]} hide />
        <YAxis type='category' dataKey='name' hide />

        <Legend
          iconType='circle'
          verticalAlign='bottom'
          align='center'
          wrapperStyle={{
            fontSize: 14,
            width: '100%',
          }}
          content={renderLegend}
        />

        <Bar
          dataKey='carbs'
          stackId='a'
          fill={colors.carbs}
          radius={[99, 0, 0, 99]}
          barCategoryGap='30%'
        >
          <LabelList
            dataKey='carbs'
            position='center'
            fill='#fff'
            formatter={(value) => `${value}%`}
          />
        </Bar>
        <Bar dataKey='protein' stackId='a' fill={colors.protein}>
          <LabelList
            dataKey='protein'
            position='center'
            fill='#fff'
            formatter={(value) => `${value}%`}
          />
        </Bar>
        <Bar dataKey='fat' stackId='a' fill={colors.fat} radius={[0, 99, 99, 0]}>
          <LabelList
            dataKey='fat'
            position='center'
            fill='#fff'
            formatter={(value) => `${value}%`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
