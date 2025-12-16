import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";

interface Order {
  _id: string;
  createdAt: string;
}

export default function OrdersPerDayChart() {
  const [days, setDays] = useState<string[]>([]);
  const [orders, setOrders] = useState<number[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get<{ orders: Order[] }>(
          "http://localhost:5000/api/order/all-orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Initialize weekdays
        const ordersPerDay: number[] = Array(7).fill(0);

        // Count orders per weekday
        data.orders.forEach((order) => {
          const dayIndex = new Date(order.createdAt).getDay(); 
          ordersPerDay[dayIndex] += 1;
        });

        setDays(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
        setOrders(ordersPerDay);
      } catch (error) {
        console.error("Error fetching orders for chart:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
      <LineChart
        width={Math.max(500, days.length * 80)} 
        height={320}
        xAxis={[{ scaleType: "point", data: days }]}
        series={[
          {
            label: "Orders",
            data: orders,
            showMark: true,
          },
        ]}
        sx={{
          ".MuiLineElement-root": { strokeWidth: 3 },
          ".MuiMarkElement-root": { r: 4 },
        }}
      />
    </div>
  );
}
