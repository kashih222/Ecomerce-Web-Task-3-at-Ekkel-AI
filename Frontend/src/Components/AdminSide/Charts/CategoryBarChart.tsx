import { BarChart } from "@mui/x-charts/BarChart";
import type { BarSeriesType } from "@mui/x-charts";
import { Box, Typography } from "@mui/material";
import { categoriesData, topCategory } from "./categoriesData";

const chartSettings = {
  yAxis: [{ label: "Number of Items", width: 20 }],
  height: 350,
};

export default function CategoryBarChart() {
  const dataset = categoriesData.map((c) => ({
    category: c.name,
    items: c.count,
  }));

  // Get index of top category
  const topIndex = dataset.findIndex(
    (row) => row.category === topCategory.name
  );

  const series: Omit<BarSeriesType, "type">[] = [
    {
      dataKey: "items",
      label: "Items",
      valueFormatter: (value, context) => {
        const isTop = context.dataIndex === topIndex;
        return isTop ? `${value} ★` : `${value}`;
      },
      highlightScope: {
        highlight: "item",
        fade: "global",
      },
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto",overflowX: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        <p className="text-black">Store Item Categories – Items per Category</p>
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        <p className="text-black">
          {" "}
          Most items: <strong>{topCategory.name}</strong> ({topCategory.count}{" "}
          items)
        </p>
      </Typography>

      <BarChart
      width={500}
        dataset={dataset}
        xAxis={[{ dataKey: "category" }]}
        series={series}
        {...chartSettings}
       
      />
    </Box>
  );
}
