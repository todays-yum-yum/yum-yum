import React from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList, Legend, ResponsiveContainer } from 'recharts';
// 스토어
import { useSelectedFoodsStore } from '@/stores/useSelectedFoodsStore';
// 유틸
import { toNum, roundTo1 } from '@/utils/nutrientNumber';
import { calculateNutrientRatio } from '@/utils/calorieCalculator';

export default function TotalBarChart() {
  const NUTRIENT_COLORS = { carbs: '#FF5094', protein: '#FFD653', fat: '#2F73E5' };
  const MIN_BAR_WIDTH = 10;

  const { selectedFoods } = useSelectedFoodsStore();
  const foods = Object.values(selectedFoods); // 선택된 음식

  // 총 탄수화물, 총 단백질, 총 지방, 총 합
  const totalCarbs = roundTo1(foods.reduce((sum, f) => sum + toNum(f.nutrient?.carbs), 0));
  const totalProtein = roundTo1(foods.reduce((sum, f) => sum + toNum(f.nutrient?.protein), 0));
  const totalFat = roundTo1(foods.reduce((sum, f) => sum + toNum(f.nutrient?.fat), 0));
  const totalNutrient = totalCarbs + totalProtein + totalFat;

  // 칼로리 기준 비율 계산
  const { carbsRatio, proteinsRatio, fatsRatio } = calculateNutrientRatio(
    totalCarbs,
    totalProtein,
    totalFat,
  );

  // 차트 최소 너비
  const carbsWidth = carbsRatio > 0 ? Math.max(carbsRatio, MIN_BAR_WIDTH) : 0;
  const proteinWidth = proteinsRatio > 0 ? Math.max(proteinsRatio, MIN_BAR_WIDTH) : 0;
  const fatWidth = fatsRatio > 0 ? Math.max(fatsRatio, MIN_BAR_WIDTH) : 0;

  // 100% 유지
  const sumWidth = carbsWidth + proteinWidth + fatWidth;
  const scale = sumWidth > 0 ? 100 / sumWidth : 1;

  // 값이 하나도 없을 때 기본값 주기
  const isEmpty = totalNutrient === 0;

  const nutrientData = [
    {
      name: '영양소',
      carbs: isEmpty ? 100 : carbsWidth * scale,
      protein: isEmpty ? 100 : proteinWidth * scale,
      fat: isEmpty ? 100 : fatWidth * scale,
      carbsPercent: isEmpty ? 0 : carbsRatio,
      proteinPercent: isEmpty ? 0 : proteinsRatio,
      fatPercent: isEmpty ? 0 : fatsRatio,
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
      <LegendItem color={NUTRIENT_COLORS.carbs} text={`탄 ${totalCarbs}g`} />
      <LegendItem color={NUTRIENT_COLORS.protein} text={`단 ${totalProtein}g`} />
      <LegendItem color={NUTRIENT_COLORS.fat} text={`지 ${totalFat}g`} />
    </div>
  );

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart layout='vertical' data={nutrientData}>
        <XAxis type='number' domain={[0, 100]} hide />
        <YAxis type='category' dataKey='name' hide />
        <Legend content={renderLegend} />

        {/* 탄수화물 */}
        <Bar dataKey='carbs' stackId='a' fill={NUTRIENT_COLORS.carbs} radius={[99, 99, 99, 99]}>
          <LabelList
            dataKey='carbsPercent'
            position='center'
            fill='#fff'
            fontSize='12'
            fontWeight='800'
            formatter={(v) => (v > 0 ? `${v}%` : '')}
          />
        </Bar>

        {/* 단백질 */}
        <Bar dataKey='protein' stackId='a' fill={NUTRIENT_COLORS.protein} radius={[99, 99, 99, 99]}>
          <LabelList
            dataKey='proteinPercent'
            position='center'
            fill='#fff'
            fontSize='12'
            fontWeight='800'
            formatter={(v) => (v > 0 ? `${v}%` : '')}
          />
        </Bar>

        {/* 지방 */}
        <Bar dataKey='fat' stackId='a' fill={NUTRIENT_COLORS.fat} radius={[99, 99, 99, 99]}>
          <LabelList
            dataKey='fatPercent'
            position='center'
            fill='#fff'
            fontSize='12'
            fontWeight='800'
            formatter={(v) => (v > 0 ? `${v}%` : '')}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
