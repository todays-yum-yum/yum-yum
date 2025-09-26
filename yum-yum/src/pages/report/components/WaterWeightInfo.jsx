import clsx from 'clsx';
import React from 'react';
import { roundTo1, toNum } from '@/utils/nutrientNumber';
import { convertMlToL } from '@/utils/reportDataParser';
import { formatTime } from '@/utils/reportDataParser';

function InfoData({ datas, unit, period }) {
  const textStyle = 'font-bold text-xl';

  // console.log('data', period, ' : ', datas);

  const getLabelByPeriod = (datas, period) => {
    switch (period) {
      case '일간': {
        if (unit === 'L') {
          return formatTime(toNum(datas.timestamp?.seconds || 0), period);
        } else if (unit === 'Kg') {
          return formatTime(datas.date, '주간');
        }

        return '';
      }

      case '주간': {
        if (unit === 'L') {
          return formatTime(datas.date || '1970-01-01', period);
        } else if (unit === 'Kg') {
          return datas.weekRange || '01/01~12/31';
        }
        return '';
      }
      case '월간': {
        if (unit === 'L') {
          return datas?.weekRange ?? '';
        } else if (unit === 'Kg') {
          return datas.monthName || '01/01~12/31';
        }
        return;
      }

      default:
        return '';
    }
  };

  const getAmountByPeriod = (datas, period, unit) => {
    switch (period) {
      case '일간': {
        if (unit === 'L') {
          return roundTo1(convertMlToL(toNum(datas.amount) || 0));
        } else if (unit === 'Kg') {
          const normalize = datas.weight === 0 ? '-' : roundTo1(datas.weight || 0);

          return normalize;
        }
        return datas.amount;
      }

      case '주간': {
        if (unit === 'L') {
          return roundTo1(convertMlToL(toNum(datas?.value?.dailyTotal ?? 0)));
        } else if (unit === 'Kg') {
          const normalize = datas.weight === 0 ? '-' : roundTo1(datas.weight || 0);

          return normalize;
        }
        return '';
      }
      case '월간': {
        if (unit === 'L') {
          const amout = datas?.value?.avgDailyTotal ?? 0;
          return roundTo1(convertMlToL(toNum(amout)));
        } else if (unit === 'Kg') {
          const normalize = datas.weight === 0 ? '-' : roundTo1(datas.weight || 0);

          return normalize;
        }
        return '';
      }

      default:
        return '';
    }
  };

  const label = getLabelByPeriod(datas, period);
  const amount = getAmountByPeriod(datas, period, unit);

  // 정보 상세
  return (
    <div className='w-full flex flex-row items-center justify-around'>
      <span className={clsx(textStyle, 'w-35')}>{label}</span>
      <span className={clsx(textStyle, 'text-center', 'w-20')}>{''} </span>
      <span className={clsx(textStyle, 'text-right', 'w-30')}>
        {amount} {unit}
      </span>
    </div>
  );
}

function InfoSection({ rowData, unit, period }) {
  // console.log(new Date(rowData.timestamp.seconds * 1000));

  // console.log('row', rowData);

  // 정보 열별로
  return (
    <>
      <article className='w-full flex flex-col p-2.5 gap-2.5 border-b-1 border-gray-300'>
        <InfoData datas={rowData} unit={unit} period={period} />
      </article>
    </>
  );
}

export default function WaterWeightInfo({ period, date, unit, total, datas = [] }) {
  const periodLabel = () => {
    let label = period !== '월간' ? date : date.slice(0, 5);

    if (unit === 'Kg') {
      label = period === '월간' ? label : '현재';
    }

    return label;
  };

  // console.log('datas', datas);

  const getRowDataByPeriod = (datas, period) => {
    if (!datas || datas.length === 0) return []; // datas가 없으면 []

    switch (period) {
      case '일간':
        {
          if (unit === 'L') {
            const dayData = datas[0]; // 일간은 하나만
            if (!dayData || !dayData.value || dayData.value === 0) return []; // value가 없으면 빈 배열
            return Array.isArray(dayData.value.intakes) ? dayData.value.intakes : [];
          } else if (unit === 'Kg') {
            return datas;
          }
        }
        return [];
      case '주간':
        return datas;
      case '월간':
        return datas;

      default:
        return [];
    }
  };

  const dataHeader = (total) => {
    if (unit === 'Kg') {
      const normalize = total === 0 ? '-' : roundTo1(total || 0);

      return normalize;
    }

    return roundTo1(total || 0);
  };

  const dataByPeriod = datas ? getRowDataByPeriod(datas, period) : [];

  // console.log(datas, dataByPeriod);

  return (
    <section className='w-full flex flex-col items-center gap-7.5 mt-2.5 mb-2.5 '>
      {/* 헤더 */}
      <article className='w-full flex flex-col p-2.5 gap-2.5 border-b-1 border-gray-300'>
        <div className='w-full flex flex-row items-center justify-around'>
          <span className='w-55 font-bold text-xl'>{periodLabel()}</span>
          <span className='w-5 font-bold text-2xl'>{''} </span>
          <span className={clsx('w-30 font-bold text-2xl', 'text-right')}>
            {dataHeader(total)} {unit}
          </span>
        </div>
      </article>

      {/* 데이터 */}

      {dataByPeriod?.map((d, i) => (
        <InfoSection key={i} rowData={d} unit={unit} period={period} />
      ))}
    </section>
  );
}
