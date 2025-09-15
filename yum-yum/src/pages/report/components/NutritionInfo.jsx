import clsx from 'clsx';
import React from 'react';
import { calculateNutrientRatio } from '../../../utils/calorieCalculator';


const safeFormatPercent = (value) => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return `${value} %`;
  }
  return ''; // undefined, NaN, null 등은 빈 문자열
};


function InfoData({ label, percent, value, isSub }) {
  const textStyle = clsx('w-30 font-bold text-2xl', isSub && 'text-gray-500 text-xl font-normal');
  // 음식 정보 상세

  return (
    <div className='w-full flex flex-row items-center justify-around'>
      <span className={textStyle}>{label}</span>
      <span className={clsx(textStyle, 'text-center')}>{percent ? percent : ''} </span>
      <span className={clsx(textStyle, 'text-right')}>{value}</span>
    </div>
  );
}

function InfoSection({ rowData }) {
  // console.log(rowData);

  // 영양소 정보 열별로
  return (
    <article className='w-full flex flex-col p-2.5 gap-2.5 border-b-1 border-gray-300'>
      <InfoData {...rowData} />

      {rowData.subs?.map((sub, i) => (
        <InfoData key={i} {...sub} />
      ))}
    </article>
  );
}

export default function NutritionInfo({ nutritionData }) {
  // console.log(nutritionData)

  const {carbsRatio, proteinsRatio, fatsRatio} = calculateNutrientRatio(nutritionData.totalCarbs, nutritionData.totalProtein, nutritionData.totalFat)

  console.log(carbsRatio, proteinsRatio, fatsRatio)

    // 매핑 필드
  const nutritionMapping = [
    {
      label: '총 열량',
      percent: '',
      value: `${nutritionData.totalCalories ?? 0} Kcal`,
    },
    {
      label: '탄수화물',
      percent: safeFormatPercent(carbsRatio),
      value: `${nutritionData.totalCarbs ?? 0} g`,
      subs: [
        { label: '당류', value: `${nutritionData.totalSugar ?? 0} g`, isSub: true },
        { label: '대체감미료', value: `${nutritionData.totalSweetener ?? 0} g`, isSub: true },
        { label: '식이섬유', value: `${nutritionData.totalFiber ?? 0} g`, isSub: true },
      ],
    },
    {
      label: '단백질',
      percent: safeFormatPercent(proteinsRatio),
      value: `${nutritionData.totalProtein ?? 0} g`,
    },
    {
      label: '지방',
      percent:  safeFormatPercent(fatsRatio),
      value: `${nutritionData.totalFat ?? 0} g`,
      subs: [
        { label: '포화지방산', value: `${nutritionData.totalSaturatedFat ?? 0} g`, isSub: true },
        { label: '트랜스지방', value: `${nutritionData.totalTransFat ?? 0} g`, isSub: true },
        { label: '불포화지방', value: `${nutritionData.totalUnsaturatedFat ?? 0} g`, isSub: true },
      ],
    },
    {
      label: '콜레스테롤',
      percent: '',
      value: `${nutritionData.totalCholesterol ?? 0} mg`,
    },
    {
      label: '나트륨',
      percent: '',
      value: `${nutritionData.totalSodium ?? 0} mg`,
    },
    {
      label: '카페인',
      percent: '',
      value: `${nutritionData.totalCaffeine ?? 0} mg`,
    },
  ];

  return (
    <section className='w-full flex flex-col items-center gap-7.5 mt-2.5 mb-2.5 '>
      {nutritionMapping.map((nutrition, i) => (
        <InfoSection key={i} rowData={nutrition} />
      ))}
    </section>
  );
}
