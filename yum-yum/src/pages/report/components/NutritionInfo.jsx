import clsx from 'clsx';
import React from 'react';

function InfoData({ label, percent, value, isSub }) {
  const textStyle = clsx('w-30 font-bold text-2xl', isSub && 'text-gray-500 text-xl font-normal');

  // 음식 정보 상세
  return (
    <div className='w-full flex flex-row items-center justify-around'>
      <span className={textStyle}>{label}</span>
      <span className={clsx(textStyle, 'text-center')}>{percent === '' ? percent : ''} </span>
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
  // 매핑 필드
  const nutritionMapping = [
    {
      label: '총 열량',
      percent: '',
      value: `${nutritionData.kcal} Kcal`,
    },
    {
      label: '탄수화물',
      percent: '40%',
      value: `${nutritionData.carbs} g`,
      subs: [
        { label: '당류', value: `${nutritionData.sugar} g`, isSub: true },
        { label: '대체감미료', value: `${nutritionData.sweetener} g`, isSub: true },
        { label: '식이섬유', value: `${nutritionData.fiber} g`, isSub: true },
      ],
    },
    {
      label: '단백질',
      percent: '30%',
      value: `${nutritionData.protein} g`,
    },
    {
      label: '지방',
      percent: '30%',
      value: `${nutritionData.fat} g`,
      subs: [
        { label: '포화지방산', value: `${nutritionData.satFat} g`, isSub: true },
        { label: '트랜스지방', value: `${nutritionData.transFat} g`, isSub: true },
        { label: '불포화지방', value: `${nutritionData.unsatFat} g`, isSub: true },
      ],
    },
    {
      label: '콜레스테롤',
      percent: '',
      value: `${nutritionData.cholesterol} mg`,
    },
    {
      label: '나트륨',
      percent: '',
      value: `${nutritionData.sodium} mg`,
    },
    {
      label: '카페인',
      percent: '',
      value: `${nutritionData.caffeine} mg`,
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
