import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatTime, convertMlToL } from '@/utils/reportDataParser';
import { toNum } from '@/utils/NutrientNumber';
import { roundTo1 } from '@/utils/NutrientNumber';

export default function LineCharts({ datas, activePeriod, unit }) {
  const mapToChartData = (datas, period) => {
    if (!datas || datas.length === 0) return [];

    switch (period) {
      case '일간': {
        const chartData = datas.flatMap((day) => {
          if (!day.value || !Array.isArray(day.value.intakes)) return [];
          return day.value.intakes.map((intake, idx) => ({
            name: formatTime(toNum(intake.timestamp?.seconds || 0), period),
            pv: roundTo1(convertMlToL(intake.amount ?? 0)),
          }));
        });

        // 데이터가 없을 때 처리
        if (chartData.length === 0) {
          return [{ name: '데이터 없음', pv: 0 }];
        }

        return chartData;
      }

      case '주간':
        return datas.map((item) => ({
          name: item?.date,
          pv: roundTo1(convertMlToL(item.value?.dailyTotal ?? 0)),
        }));

      case '월간':
        return datas.map((item) => ({
          name: item.weekRange, // ex: '9/1 ~ 9/7'
          pv: roundTo1(convertMlToL(item.value?.avgDailyTotal ?? 0)),
        }));

      default:
        return [];
    }
  };

  const chartData = mapToChartData(datas, activePeriod);

  // console.log(datas);

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
      <Line type='monotone' name={`섭취량`} dataKey='pv' stroke='#F407A8' activeDot={{ r: 8 }} />
    </LineChart>
  );
}
