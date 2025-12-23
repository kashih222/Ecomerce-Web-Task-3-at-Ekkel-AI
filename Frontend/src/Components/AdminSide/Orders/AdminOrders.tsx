import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
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
  fullname?: string;
  email?: string;
}

interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

interface Order {
  _id: string;
  userId: string;
  user?: UserInfo | null;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  shippingDetails?: ShippingDetails;
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  // Fetch orders using GraphQL
  const { data, loading, error, refetch } = useQuery(GET_ORDERS);
  
  // Update order status mutation
  const [updateOrderStatus, { loading: updateLoading }] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: () => {
      toast.success("Order status updated successfully!");
      setModalOpen(false);
      refetch(); // Refetch orders to update the list
    },
    onError: (error) => {
      console.error("Update status error:", error);
      toast.error(`Failed to update order status: ${error.message}`);
    },
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("Pending");

  // Handle query errors with useEffect instead of onError callback
  useEffect(() => {
    if (error) {
      console.error("🚨 GraphQL Error Details:");
      console.error("Full error:", error);
      console.error("GraphQL Errors:", error.graphQLErrors);
      console.error("Network Error:", error.networkError);
      
      // Check browser Network tab for actual error
      console.log("📋 Check browser Network tab for the failed GraphQL request");
      console.log("📋 Look for the POST request to /graphql and check Response tab");
    }
  }, [error]);

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
    } catch (error) {
      // Error is handled in onError callback
      console.error("Update error:", error);
    }
  };

  // Handle query errors
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">All Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 font-semibold">Error loading orders</p>
          <p className="text-red-500 mb-2">{error.message}</p>
          <p className="text-sm text-gray-600 mb-3">
            Check your GraphQL schema. The query might be requesting fields that don't exist.
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Debug steps:</strong></p>
            <p>1. Open Developer Tools (F12)</p>
            <p>2. Go to Network tab</p>
            <p>3. Filter by "graphql" requests</p>
            <p>4. Click on the failed request</p>
            <p>5. Check the Response tab for detailed error</p>
          </div>
        </div>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
        
        {/* Try a simpler query for debugging */}
        <button 
          onClick={async () => {
            try {
              // Try a minimal query
              const simpleQuery = `
                query GetSimpleOrders {
                  getOrders {
                    _id
                    status
                    totalPrice
                  }
                }
              `;
              console.log("Trying simple query:", simpleQuery);
              await refetch();
            } catch (err) {
              console.error("Simple query also failed:", err);
            }
          }}
          className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Try Simple Query
        </button>
      </div>
    );
  }

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  // Extract and sort orders from GraphQL response
  const orders: Order[] = data?.getOrders 
    ? [...data.getOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm truncate `max-w-[100px]`">
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="p-4">
                    {order.user?.fullname || "Unknown"}
                  </td>
                  <td className="p-4">{order.user?.email || "N/A"}</td>
                  <td className="p-4">{order.items.length} items</td>
                  <td className="p-4">
                    ${Number(order?.totalPrice ?? 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Delivered" ? "bg-green-100 text-green-800" :
                      order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                      order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openOrder(order)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
                      disabled={updateLoading}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 `w-[600px]` max-w-[90vw] shadow-xl overflow-y-auto max-h-[80vh]">
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
                <strong>Customer:</strong>{" "}
                {selectedOrder.user?.fullname || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.user?.email || "N/A"}
              </p>
              
              {selectedOrder.shippingDetails && (
                <>
                  <h3 className="text-lg font-semibold mt-4">Shipping Details</h3>
                  <div className="mt-2 space-y-1 bg-gray-100 p-3 rounded">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedOrder.shippingDetails?.fullName || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedOrder.shippingDetails?.email || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedOrder.shippingDetails?.phone || "N/A"}
                    </p>
                    <p>
                      <strong>City:</strong>{" "}
                      {selectedOrder.shippingDetails?.city || "N/A"}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedOrder.shippingDetails?.address || "N/A"}
                    </p>
                  </div>
                </>
              )}

              <p>
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

              <h3 className="text-lg font-semibold mt-4 mb-2">Order Items:</h3>
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