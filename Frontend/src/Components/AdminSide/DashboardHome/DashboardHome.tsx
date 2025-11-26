import { ChartBar, Users, ShoppingCart, DollarSign } from "lucide-react";
import CategoryBarChart from "../Charts/CategoryBarChart";
import MarkOptimizationChart from "../Charts/MarkOptimizationChart";

const DashboardHome = () => {
  return (
    <div className=" bg-gray-100 min-h-screen w-full">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow flex items-center  gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-xl font-bold text-gray-800">1,234</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <ShoppingCart className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Orders</p>
            <p className="text-xl font-bold text-gray-800">567</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <DollarSign className="text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Revenue</p>
            <p className="text-xl font-bold text-gray-800">$12,345</p>
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

      {/* Charts / Graph Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400"><CategoryBarChart/></p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400"><MarkOptimizationChart/></p>
        </div>
      </div>

      {/* Recent Activity / Orders Table */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2">#1001</td>
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2">2025-11-25</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Completed</span>
                </td>
                <td className="px-4 py-2">$120.00</td>
              </tr>
              <tr>
                <td className="px-4 py-2">#1002</td>
                <td className="px-4 py-2">Jane Smith</td>
                <td className="px-4 py-2">2025-11-24</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Pending</span>
                </td>
                <td className="px-4 py-2">$80.00</td>
              </tr>
              <tr>
                <td className="px-4 py-2">#1003</td>
                <td className="px-4 py-2">Alice Johnson</td>
                <td className="px-4 py-2">2025-11-23</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Cancelled</span>
                </td>
                <td className="px-4 py-2">$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
