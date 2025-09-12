import clsx from 'clsx';
import React from 'react';

function InfoData({ label, value, unit }) {
  const textStyle = 'w-30 font-bold text-2xl';

  // 정보 상세
  return (
    <div className='w-full flex flex-row items-center justify-around'>
      <span className={textStyle}>{label}</span>
      <span className={clsx(textStyle, 'text-center')}>{''} </span>
      <span className={clsx(textStyle, 'text-right')}>{value}{' '}{unit}</span>
    </div>
  );
}

function InfoSection({ rowData, unit }) {
  // console.log(rowData);

  // 정보 열별로
  return (
    <article className='w-full flex flex-col p-2.5 gap-2.5 border-b-1 border-gray-300'>
      <InfoData {...rowData} unit={unit} />
    </article>
  );
}

export default function WaterWeightInfo({ period, date, unit, datas = [] }) {
  const data = [
    {
      label: '일',
      value: 2400,
    },
    {
      label: '월',
      value: 1398,
    },
    {
      label: '화',
      value: 7800,
    },
    {
      label: '수',
      value: 3908,
    },
    {
      label: '목',
      value: 4800,
    },
    {
      label: '금',
      value: 3800,
    },
    {
      label: '토',
      value: 4300,
    },
  ];

  const periodLabel = period !== '월간' ? date : date.slice(0,5);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <section className='w-full flex flex-col items-center gap-7.5 mt-2.5 mb-2.5 '>
      {/* 헤더 */}
      <article className='w-full flex flex-col p-2.5 gap-2.5 border-b-1 border-gray-300'>
        <div className='w-full flex flex-row items-center justify-around'>
          <span className='w-55 font-bold text-xl'>{periodLabel}</span>
          <span className='w-5 font-bold text-2xl'>{''} </span>
          <span className={clsx('w-30 font-bold text-2xl', 'text-right')}>{total}{' '}{unit}</span>
        </div>
      </article>

      {/* 데이터 */}
      {data.map((d, i) => (
        <InfoSection key={i} rowData={d} unit={unit} />
      ))}
    </section>
  );
}
