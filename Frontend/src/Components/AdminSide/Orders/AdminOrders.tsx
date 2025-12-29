import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { Search, Filter } from "lucide-react";
import { UPDATE_ORDER_STATUS } from "../../../GraphqlOprations/mutation";
import { GET_ORDERS } from "../../../GraphqlOprations/queries";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  images?: { thumbnail?: string };
}

interface UserInfo {
  _id?: string;
  fullname?: string;
  email?: string;
}

interface ShippingDetails {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
}

interface Order {
  _id: string;
  userId?: string;
  user?: UserInfo | null;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  shippingDetails?: ShippingDetails;
  createdAt: string;
}

// Helper functions outside component to avoid dependency issues
const getCustomerInfo = (order: Order) => {
  // Priority 1: User object from populated field
  if (order.user?.fullname) {
    return {
      name: order.user.fullname,
      email: order.user.email || "N/A"
    };
  }
  
  // Priority 2: Shipping details
  if (order.shippingDetails?.fullName) {
    return {
      name: order.shippingDetails.fullName,
      email: order.shippingDetails.email || "N/A"
    };
  }
  
  // Priority 3: Check if user object exists but name is empty
  if (order.user && !order.user.fullname) {
    return {
      name: "Customer",
      email: order.user.email || "N/A"
    };
  }
  
  // Fallback
  return {
    name: "Unknown Customer",
    email: "N/A"
  };
};

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return "Invalid Date";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid Date";
  }
};

const AdminOrders: React.FC = () => {
  // Fetch orders using GraphQL
  const { data, loading, error, refetch } = useQuery(GET_ORDERS);
  
  // Update order status mutation
  const [updateOrderStatus, { loading: updateLoading }] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: () => {
      toast.success("Order status updated successfully!");
      setModalOpen(false);
      refetch();
    },
    onError: (error) => {
      console.error("Update status error:", error);
      toast.error(`Failed to update order status: ${error.message}`);
    },
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalOpen(true);
  };

  const updateStatus = async (statusToUpdate: string) => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus({
        variables: {
          orderId: selectedOrder._id,
          status: statusToUpdate,
        },
      });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Extract and sort orders from GraphQL response
  const allOrders: Order[] = useMemo(() => {
    if (!data?.getOrders) return [];
    
    return [...data.getOrders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data]);

  // Filter orders based on search query and status filter
  const filteredOrders = useMemo(() => {
    if (!allOrders.length) return [];

    return allOrders.filter((order) => {
      // Apply status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // If no search query, return all filtered by status
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();
      const customer = getCustomerInfo(order);
      
      // Search in order ID
      if (order._id.toLowerCase().includes(query)) return true;
      
      // Search in customer name
      if (customer.name.toLowerCase().includes(query)) return true;
      
      // Search in customer email
      if (customer.email.toLowerCase().includes(query)) return true;
      
      // Search in shipping details
      if (order.shippingDetails?.fullName?.toLowerCase().includes(query)) return true;
      if (order.shippingDetails?.email?.toLowerCase().includes(query)) return true;
      
      // Search in order status
      if (order.status.toLowerCase().includes(query)) return true;
      
      // Search in total price
      if (order.totalPrice.toString().includes(query)) return true;
      
      // Search in order date
      const formattedDate = formatDateTime(order.createdAt).toLowerCase();
      if (formattedDate.includes(query)) return true;
      
      return false;
    });
  }, [allOrders, searchQuery, statusFilter]);

  // Get count of orders by status
  const statusCounts = useMemo(() => {
    const counts = {
      all: allOrders.length,
      Pending: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    
    allOrders.forEach((order) => {
      if (Object.prototype.hasOwnProperty.call(counts, order.status)) {
        counts[order.status as keyof typeof counts]++;
      }
    });
    
    return counts;
  }, [allOrders]);

  // Handle query errors
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">All Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 font-semibold">Error loading orders</p>
          <p className="text-red-500 mb-2">{error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Email, Status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="Pending">Pending ({statusCounts.Pending})</option>
                <option value="Shipped">Shipped ({statusCounts.Shipped})</option>
                <option value="Delivered">Delivered ({statusCounts.Delivered})</option>
                <option value="Cancelled">Cancelled ({statusCounts.Cancelled})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Summary */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>
            Showing {filteredOrders.length} of {allOrders.length} orders
          </span>
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600 text-lg mb-2">No orders found</p>
          {searchQuery || statusFilter !== "all" ? (
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          ) : (
            <p className="text-gray-500">No orders have been placed yet</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Order ID</th>
                  <th className="p-4 font-semibold text-gray-700">Customer</th>
                  <th className="p-4 font-semibold text-gray-700">Email</th>
                  <th className="p-4 font-semibold text-gray-700">Items</th>
                  <th className="p-4 font-semibold text-gray-700">Total</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                  <th className="p-4 font-semibold text-gray-700">Date & Time</th>
                  <th className="p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const customer = getCustomerInfo(order);
                  const formattedDate = formatDateTime(order.createdAt);
                  
                  const getRelativeTime = (dateString: string) => {
                    try {
                      const date = new Date(dateString);
                      if (isNaN(date.getTime())) return "";
                      
                      const now = new Date();
                      const diffMs = now.getTime() - date.getTime();
                      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                      
                      if (diffHours < 1) {
                        const diffMinutes = Math.floor(diffMs / (1000 * 60));
                        return `${diffMinutes}m ago`;
                      } else if (diffHours < 24) {
                        return `${diffHours}h ago`;
                      } else {
                        const diffDays = Math.floor(diffHours / 24);
                        return `${diffDays}d ago`;
                      }
                    } catch (err) {
                      console.log(err)
                      return "";
                    }
                  };
                  
                  return (
                    <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="text-sm font-mono text-gray-800">
                          #{order._id.substring(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-30">
                          {order._id}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{customer.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm truncate max-w-45" title={customer.email}>
                          {customer.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {order.items.length} items
                        </span>
                      </td>
                      <td className="p-4 font-semibold">
                        ${Number(order?.totalPrice ?? 0).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered" ? "bg-green-100 text-green-800" :
                          order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                          order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{formattedDate}</div>
                        <div className="text-xs text-gray-500">
                          {getRelativeTime(order.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => openOrder(order)}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 text-sm font-medium"
                          disabled={updateLoading}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-150 max-w-[90vw] shadow-xl overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p>
                <strong>Order ID:</strong>{" "}
                <span className="text-sm font-mono">{selectedOrder._id}</span>
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {formatDateTime(selectedOrder.createdAt)}
              </p>
              
              {/* Customer Information Section */}
              <div className="bg-gray-50 p-3 rounded-lg mt-4">
                <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
                
                {/* User information (from populated user field) */}
                {(selectedOrder.user?.fullname || selectedOrder.user?.email) && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Account Information:</p>
                    <p><strong>Name:</strong> {selectedOrder.user.fullname || "Not provided"}</p>
                    <p><strong>Email:</strong> {selectedOrder.user.email || "Not provided"}</p>
                  </div>
                )}
                
                {/* Shipping information */}
                {selectedOrder.shippingDetails && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shipping Information:</p>
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedOrder.shippingDetails.fullName || "Not provided"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedOrder.shippingDetails.email || "Not provided"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedOrder.shippingDetails.phone || "Not provided"}
                    </p>
                    <p>
                      <strong>City:</strong>{" "}
                      {selectedOrder.shippingDetails.city || "Not provided"}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedOrder.shippingDetails.address || "Not provided"}
                    </p>
                  </div>
                )}
                
                {/* Fallback if no customer info */}
                {!selectedOrder.user?.fullname && !selectedOrder.shippingDetails?.fullName && (
                  <p className="text-gray-500 italic">No customer information available</p>
                )}
              </div>

              <p className="mt-4">
                <strong>Total Price:</strong> $
                {selectedOrder.totalPrice.toFixed(2)}
              </p>

              <div className="mt-3">
                <strong>Status:</strong>
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={newStatus}
                    onChange={(e) => {
                      if (newStatus === "Cancelled") return;
                      setNewStatus(e.target.value);
                    }}
                    className="border p-2 rounded flex-1"
                    disabled={updateLoading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => updateStatus(newStatus)}
                    disabled={updateLoading || newStatus === selectedOrder.status}
                    className={`px-4 py-2 text-white rounded ${
                      updateLoading ? "bg-gray-400" : 
                      newStatus === selectedOrder.status ? "bg-gray-300" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {updateLoading ? "Updating..." : "Save"}
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-4 mb-2">Order Items ({selectedOrder.items.length}):</h3>
              <ul className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 border-b pb-2"
                  >
                    {item.images?.thumbnail ? (
                      <img
                        src={item.images.thumbnail}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Crect width='24' height='24' rx='4'/%3E%3Cpath d='M12 9L9 12L12 15L15 12L12 9Z' fill='%239ca3af'/%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        N/A
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span>Price: ${item.price.toFixed(2)}</span>
                        <span>Subtotal: ${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                disabled={updateLoading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;