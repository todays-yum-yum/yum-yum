import React from 'react'
import clsx from 'clsx';


function FoodData({ label, percent, value, count }) {
  const textStyle = 'w-30 font-bold text-2xl text-center';

  return (
    <div className='w-full flex flex-row items-center justify-around'>
      <span className={textStyle}>{label}</span>
      <span className={textStyle}>{percent}%</span>
      <span className={textStyle}>{value}g</span>
      <span className={textStyle}>{count}회</span>
    </div>
  );
}

function FoodSection({ rowData }) {
  console.log(rowData);

  return (
    <article className='w-full flex flex-col p-2.5 gap-2.5 border-b-1 border-gray-300'>
      <FoodData {...rowData} />
    </article>
  );
}

export default function NutritionFood({ foodData }) {

  return (
    <section className='w-full flex flex-col items-center gap-7.5 mt-2.5 mb-2.5 '>
      {foodData.map((food, i) => (
        <FoodSection key={i} rowData={food} />
      ))}
    </section>
  );
}
