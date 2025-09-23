import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatTime, convertMlToL } from '@/utils/reportDataParser';
import { toNum, roundTo1 } from '@/utils/NutrientNumber';

export default function LineCharts({ datas, activePeriod, unit }) {

  const mapToChartData = (datas, period) => {
    if (!datas || datas.length === 0) return [];

    switch (period) {
      case '일간': {
        if (unit === 'L') {
          const chartData = datas.flatMap((days) => {
            if (!days.value || !Array.isArray(days.value.intakes)) return [];

            return days.value.intakes.map((intake, idx) => ({
              name: formatTime(toNum(intake.timestamp?.seconds || 0), period),
              pv: roundTo1(convertMlToL(intake.amount ?? 0)),
            }));
          });

          // 데이터가 없을 때 처리
          if (chartData.length === 0) {
            return [{ name: '데이터 없음', pv: 0 }];
          }

          return chartData;
        } else if (unit === 'Kg') {
          const chartData = datas.flatMap((days) => {
            if (days.weight === null || days.weight === undefined) return [];

            return {
              name: days.date,
              pv: roundTo1(days.weight ?? 0),
            };
          });

          // 데이터가 없을 때 처리
          if (chartData.length === 0) {
            return [{ name: '데이터 없음', pv: 0 }];
          }

          return chartData;
        }
        return [];
      }

      case '주간': {
        if (unit === 'L') {
          return datas.map((item) => ({
            name: item?.date,
            pv: roundTo1(convertMlToL(item.value?.dailyTotal ?? 0)),
          }));
        } else if (unit === 'Kg') {
          return datas.map((item) => ({
            name: item?.weekRange,
            pv: roundTo1(item?.weight ?? 0),
          }));
        }
        return [];
      }
      case '월간': {
        if (unit === 'L') {
          return datas.map((item) => (
            {
            name: item?.weekRange, // ex: '9/1 ~ 9/7'
            pv: roundTo1(convertMlToL(item.value?.avgDailyTotal ?? 0)),
          }));
        } else if (unit === 'Kg') {
          return datas.map((item) => ({
            name: item?.monthName,
            pv: item?.weight,
          }));
        }

        return [];
      }
      default:
        return [];
    }
  };

  const chartLabel = unit === 'L' ? '섭취량' : '체중';

  const chartData = mapToChartData(datas, activePeriod);

  // console.log(datas);
  // console.log(chartData);

  return (
    <LineChart
      width={500}
      height={300}
      data={chartData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip
        formatter={(value, name) => {
          return [`${value} ${unit}`, name];
        }}
      />
      <Line type='monotone' name={chartLabel} dataKey='pv' stroke='#F407A8' activeDot={{ r: 8 }} />
    </LineChart>
  );
}
