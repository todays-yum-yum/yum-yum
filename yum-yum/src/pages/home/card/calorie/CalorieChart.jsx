import React from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';
import clsx from 'clsx';

export default function CalorieChart({ currentCalories = 1800, totalCalories = 1800 }) {
  // 목표 달성 여부에 따른 색상 결정
  const isOverTarget = currentCalories > totalCalories;
  const currentColor = isOverTarget ? '#FF5094' : '#12B76A'; // 초과시 빨강, 미달시 초록
  const remainingColor = '#EAECF0'; // 남은 부분은 회색

  const calorieRatioData = [
    {
      name: '총 섭취량',
      value: Math.min(currentCalories, totalCalories), // 목표치를 넘으면 목표치까지만
      fill: currentColor,
    },
    {
      name: '남은 칼로리',
      value: Math.max(totalCalories - currentCalories, 0), // 음수가 되지 않도록
      fill: remainingColor,
    },
  ];

  // 목표 초과시
  const overTargetData = [
    { name: '목표 칼로리', value: totalCalories, fill: '#12B76A' },
    { name: '초과 칼로리', value: currentCalories - totalCalories, fill: '#FF5094' },
  ];
  const chartData = isOverTarget ? overTargetData : calorieRatioData;

  return (
    <div className='flex justify-center mb-12'>
      <div className='relative w-80 h-80'>
        {' '}
        {/* 크기 증가 */}
        <PieChart width={320} height={280}>
          {' '}
          {/* PieChart 크기도 증가 */}
          <Pie
            data={chartData}
            dataKey={'value'}
            nameKey={'name'}
            innerRadius={90}
            outerRadius={120}
            cx={160}
            cy={150}
            startAngle={90}
            endAngle={-270}
          />
        </PieChart>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <div className='text-center mb-1'>
            <span
              className={clsx(
                'text-4xl font-extrabold',
                { 'text-primary': currentCalories <= totalCalories },
                { 'text-secondary-dark': currentCalories > totalCalories },
              )}
            >
              {currentCalories}
            </span>
            <span className='text-gray-500 text-xl font-extrabold'>/{totalCalories}</span>
          </div>
          <div className='text-gray-500 text-xl font-extrabold mt-1'>kcal</div>
        </div>
      </div>
    </div>
  );
}
