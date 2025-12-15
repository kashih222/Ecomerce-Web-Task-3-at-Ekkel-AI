import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  images?: { thumbnail?: string };
}

interface UserInfo {
  fullName: string;
  email: string;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("Pending");

  const FETCH_ALL_ORDER = "http://localhost:5000/api/order/all-orders";
  const UPDATE_STATUS = "http://localhost:5000/api/order/update-status/";

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get<{ orders: Order[] }>(FETCH_ALL_ORDER, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort latest → oldest
      const sortedOrders = data.orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);


  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalOpen(true);
  };

  const updateStatus = async (statusToUpdate: string) => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authorized");
        return;
      }

      await axios.put(
        `${UPDATE_STATUS}${selectedOrder._id}`,
        { status: statusToUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: statusToUpdate } : o
        )
      );

      setSelectedOrder((prev) =>
        prev ? { ...prev, status: statusToUpdate } : null
      );

      toast.success("Order status updated!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Update Status Error:", error.response || error.message);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-600">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{order._id}</td>
                  <td className="p-4">{order.user?.fullName || "Un-Known"}</td>
                  <td className="p-4">{order.user?.email || "In-Valid"}</td>
                  <td className="p-4">{order.items.length} items</td>
                  <td className="p-4">${Number(order?.totalPrice ?? 0).toFixed(2)}</td>
                  <td className="p-4">{order.status}</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => openOrder(order)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:scale-95"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[600px] shadow-xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>

            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Customer:</strong> {selectedOrder.user?.fullName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.user?.email || "N/A"}
            </p>
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

            <p className="mt-3">
              <strong>Total Price:</strong> $
              {selectedOrder.totalPrice.toFixed(2)}
            </p>

            <p className="mt-2">
              <strong>Status:</strong>{" "}
              <select
                value={newStatus}
                onChange={(e) => {
                  if (newStatus === "Cancelled") return;
                  setNewStatus(e.target.value);
                }}
                className="border p-2 rounded"
              >
                {newStatus === "Cancelled" ? (
                  <option value="Cancelled">Cancelled</option>
                ) : (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>

                    {newStatus !== "Delivered" && (
                      <option value="Cancelled">Cancelled</option>
                    )}
                  </>
                )}
              </select>
              <button
                onClick={() => updateStatus(newStatus)}
                className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
            <ul className="space-y-2">
              {selectedOrder.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-3 border-b pb-2"
                >
                  {item.images?.thumbnail ? (
                    <img
                      src={item.images.thumbnail}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      N/A
                    </div>
                  )}
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-black text-white rounded-lg hover:scale-95"
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
