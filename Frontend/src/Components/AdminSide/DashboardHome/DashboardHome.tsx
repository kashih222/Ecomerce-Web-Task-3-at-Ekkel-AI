import React, { useMemo } from "react";
import { ChartBar, Users, ShoppingCart, DollarSign } from "lucide-react";
import CategoryBarChart from "../Charts/CategoryBarChart";
import MarkOptimizationChart from "../Charts/MarkOptimizationChart";
import { useQuery } from "@apollo/client";
import { GET_ORDERS, GET_ALL_USERS, GET_ALL_PRODUCTS } from "../../../GraphqlOprations/queries";

interface User {
  _id: string;
  fullname: string;
  email: string;
  role?: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {

  _id: string;
  userId?: string;
  user?: {
    _id: string;
    fullname: string;
    email: string;
  };

  shippingDetails?: {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    address?: string;
  };

  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

const DashboardHome: React.FC = () => {

  const { data: usersData, loading: usersLoading } = useQuery(GET_ALL_USERS);
  const { data: productsData, loading: productsLoading } = useQuery(GET_ALL_PRODUCTS);
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ORDERS);

  const loading = usersLoading || productsLoading || ordersLoading;

  const dashboardStats = useMemo(() => {
    const users = usersData?.users || [];
    const products = productsData?.products || [];
    const orders = ordersData?.getOrders || [];

    const totalUsers = users.length;
    const totalProducts = products.length;
    const totalRevenue = orders.reduce(
      (sum: number, order: Order) => sum + Number(order?.totalPrice ?? 0),
      0
    );

    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ) .slice(0, 20);

    return {
      totalUsers,
      totalProducts,
      totalRevenue,
      recentOrders,
      users,
      products,
      orders,
    };
  }, [usersData, productsData, ordersData]);

  // Get user count by role
  const getRoleCounts = useMemo(() => {
    const users = dashboardStats.users as (User & { role?: string })[];
    const adminCount = users.filter((user) => user.role === "admin").length;

    const customerCount = users.filter(
      (user) => user.role === "customer" || !user.role
    ).length;

    return { admin: adminCount, customer: customerCount };
  }, [dashboardStats.users]);

  // Get order status counts
  const getOrderStatusCounts = useMemo(() => {
    const orders = dashboardStats.orders as Order[];
    const pending = orders.filter((order) => order.status === "Pending").length;

    const completed = orders.filter(
      (order) => order.status === "Completed"
    ).length;

    const cancelled = orders.filter(
      (order) => order.status === "Cancelled"
    ).length;

    return { pending, completed, cancelled };
  }, [dashboardStats.orders]);

  if (loading)
    return <div className="text-center py-20">Loading dashboard...</div>;

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
            <p className="text-xl font-bold text-gray-800">
              {dashboardStats.totalUsers}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              {getRoleCounts.admin} Admin, {getRoleCounts.customer} Customers
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <ShoppingCart className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-xl font-bold text-gray-800">
              {dashboardStats.totalProducts}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <DollarSign className="text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-xl font-bold text-gray-800">
              ${dashboardStats.totalRevenue.toFixed(2)}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              From {dashboardStats.orders.length} orders
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <ChartBar className="text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Orders</p>
            <p className="text-xl font-bold text-gray-800">
              {getOrderStatusCounts.pending}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              {getOrderStatusCounts.completed} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow min-h-75 flex items-center justify-center">
          <CategoryBarChart products={dashboardStats.products} />
        </div>
        <div className="bg-white p-5 rounded-lg shadow min-h-75 flex items-center justify-center">
          <MarkOptimizationChart orders={dashboardStats.orders} />
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
              {dashboardStats.recentOrders.map((order: Order) => {
                // Parse date safely with time
                let formattedDateTime = "Invalid Date";
                if (order.createdAt) {
                  try {
                    const date = new Date(order.createdAt);
                    if (!isNaN(date.getTime())) {
                      formattedDateTime =
                        date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) +
                        " at " +
                        date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                    }
                  } catch (error) {
                    console.error("Date parsing error:", error);
                  }
                }

                // Get customer name with fallback
                const customerName =
                  order.user?.fullname ||
                  order.shippingDetails?.fullName ||
                  "Unknown Customer";
                const customerEmail =
                  order.user?.email || order.shippingDetails?.email || "";

                return (
                  <tr key={order._id}>
                    <td className="px-4 py-2">#{order._id.slice(-6)}</td>
                    <td className="px-4 py-2">
                      {customerName}
                      {customerEmail && (
                        <div className="text-xs text-gray-500">
                          {customerEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div>{formattedDateTime}</div>
                      {order.createdAt && (
                        <div className="text-xs text-gray-500">
                          {(() => {
                            try {
                              const date = new Date(order.createdAt);
                              if (isNaN(date.getTime())) return "";

                              const now = new Date();
                              const diffMs = now.getTime() - date.getTime();
                              const diffHours = Math.floor(
                                diffMs / (1000 * 60 * 60)
                              );

                              if (diffHours < 1) {
                                const diffMinutes = Math.floor(
                                  diffMs / (1000 * 60)
                                );
                                return `${diffMinutes} minutes ago`;
                              } else if (diffHours < 24) {
                                return `${diffHours} hours ago`;
                              } else {
                                const diffDays = Math.floor(diffHours / 24);
                                return `${diffDays} days ago`;
                              }
                            } catch (error) {
                              console.log(error);
                              return "";
                            }
                          })()}
                        </div>
                      )}
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
                        {order.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      ${Number(order.totalPrice ?? 0).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {dashboardStats.recentOrders.length === 0 && (
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
