import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function LineCharts({ datas = [] }) {
  const data = [
    {
      name: '일',
      pv: 2400,
    },
    {
      name: '월',
      pv: 1398,
    },
    {
      name: '화',
      pv: 7800,
    },
    {
      name: '수',
      pv: 3908,
    },
    {
      name: '목',
      pv: 4800,
    },
    {
      name: '금',
      pv: 3800,
    },
    {
      name: '토',
      pv: 4300,
    },
  ];

  return (
    <LineChart
      width={500}
      height={300}
      data={data}
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
      <Tooltip />
      <Line type='monotone' dataKey='pv' stroke='#8884d8' activeDot={{ r: 8 }} />
    </LineChart>
  );
}
