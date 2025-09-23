import React from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList, Legend, ResponsiveContainer } from 'recharts';
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
import { toNum, roundTo1 } from '@/utils/nutrientNumber';

export default function TotalBarChart() {
  const { selectedFoods } = useSelectedFoodsStore();
  const nutrientColors = { carbs: '#FF5094', protein: '#FFD653', fat: '#2F73E5' };
  const foods = Object.values(selectedFoods); // 선택된 음식

  // 총 탄수화물, 총 단백질, 총 지방, 총 합
  const totalCarbs = roundTo1(foods.reduce((sum, f) => sum + toNum(f.nutrient?.carbs), 0));
  const totalProtein = roundTo1(foods.reduce((sum, f) => sum + toNum(f.nutrient?.protein), 0));
  const totalFat = roundTo1(foods.reduce((sum, f) => sum + toNum(f.nutrient?.fat), 0));
  const totalNutrient = totalCarbs + totalProtein + totalFat;

  // 라벨에 보여지는 퍼센트
  const carbsPercent = totalNutrient ? (totalCarbs / totalNutrient) * 100 : 0;
  const proteinPercent = totalNutrient ? (totalProtein / totalNutrient) * 100 : 0;
  const fatPercent = totalNutrient ? (totalFat / totalNutrient) * 100 : 0;

  // 차트 최소 너비
  const minWidth = 10;
  const carbsWidth = carbsPercent > 0 ? Math.max(carbsPercent, minWidth) : 0;
  const proteinWidth = proteinPercent > 0 ? Math.max(proteinPercent, minWidth) : 0;
  const fatWidth = fatPercent > 0 ? Math.max(fatPercent, minWidth) : 0;

  // 100% 유지
  const sumWidth = carbsWidth + proteinWidth + fatWidth;
  const scale = sumWidth > 0 ? 100 / sumWidth : 1;

  const nutrientData = [
    {
      name: '영양소',
      carbs: carbsWidth * scale,
      protein: proteinWidth * scale,
      fat: fatWidth * scale,
      carbsPercent,
      proteinPercent,
      fatPercent,
    },
  ];

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
      <LegendItem color={nutrientColors.carbs} text={`탄 ${totalCarbs}g`} />
      <LegendItem color={nutrientColors.protein} text={`단 ${totalProtein}g`} />
      <LegendItem color={nutrientColors.fat} text={`지 ${totalFat}g`} />
    </div>
  );

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart layout='vertical' data={nutrientData}>
        <XAxis type='number' domain={[0, 100]} hide />
        <YAxis type='category' dataKey='name' hide />
        <Legend content={renderLegend} />

        {/* 탄수화물 */}
        <Bar dataKey='carbs' stackId='a' fill={nutrientColors.carbs} radius={[99, 99, 99, 99]}>
          <LabelList
            dataKey='carbsPercent'
            position='center'
            fill='#fff'
            fontSize='12'
            fontWeight='800'
            formatter={(v) => (v > 0 ? `${Math.round(v)}%` : '')}
          />
        </Bar>

        {/* 단백질 */}
        <Bar dataKey='protein' stackId='a' fill={nutrientColors.protein} radius={[99, 99, 99, 99]}>
          <LabelList
            dataKey='proteinPercent'
            position='center'
            fill='#fff'
            fontSize='12'
            fontWeight='800'
            formatter={(v) => (v > 0 ? `${Math.round(v)}%` : '')}
          />
        </Bar>

        {/* 지방 */}
        <Bar dataKey='fat' stackId='a' fill={nutrientColors.fat} radius={[99, 99, 99, 99]}>
          <LabelList
            dataKey='fatPercent'
            position='center'
            fill='#fff'
            fontSize='12'
            fontWeight='800'
            formatter={(v) => (v > 0 ? `${Math.round(v)}%` : '')}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
