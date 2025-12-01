import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChartBar, Users, ShoppingCart, DollarSign } from "lucide-react";
import CategoryBarChart from "../Charts/CategoryBarChart";
import MarkOptimizationChart from "../Charts/MarkOptimizationChart";

interface User {
  _id: string;
  fullname: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  quantity: number;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  user?: User;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

const DashboardHome: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total users
        const usersRes = await axios.get<{ users: User[] }>(
          "http://localhost:5000/api/auth/fetch-all/all-users"
        );
        setTotalUsers(usersRes.data.users.length);

        // Fetch total products
        const productsRes = await axios.get<{ products: Product[] }>(
          "http://localhost:5000/api/product/all-products"
        );
        setTotalProducts(productsRes.data.products.length);

        // Fetch all orders
        const ordersRes = await axios.get<{ orders: Order[] }>(
          "http://localhost:5000/api/order/all-orders"
        );

        const orders = ordersRes.data.orders;

        const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        setTotalRevenue(revenue);

        const recent = orders
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 7);
        setRecentOrders(recent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="bg-gray-100 min-h-screen w-full p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-xl font-bold text-gray-800">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <ShoppingCart className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-xl font-bold text-gray-800">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <DollarSign className="text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-xl font-bold text-gray-800">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <ChartBar className="text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Performance</p>
            <p className="text-xl font-bold text-gray-800">89%</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow min-h-[300px] flex items-center justify-center">
          <CategoryBarChart />
        </div>
        <div className="bg-white p-5 rounded-lg shadow min-h-[300px] flex items-center justify-center">
          <MarkOptimizationChart />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Order ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-2">#{order._id.slice(-6)}</td>
                  <td className="px-4 py-2">{order.user?.fullname || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">${order.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
