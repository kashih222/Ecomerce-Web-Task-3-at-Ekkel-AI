import { LineChart } from '@mui/x-charts/LineChart';

export default function OrdersPerDayChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const orders = [12, 25, 18, 30, 22, 40, 28];

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
      <LineChart
        width={500}
        height={320}
        xAxis={[{ scaleType: 'point', data: days }]}
        series={[
          {
            label: 'Orders',
            data: orders,
            showMark: true,
          },
        ]}
        sx={{
          '.MuiLineElement-root': { strokeWidth: 3 },
          '.MuiMarkElement-root': { r: 4 },
        }}
      />
    </div>
  );
}
