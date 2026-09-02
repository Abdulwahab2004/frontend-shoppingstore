import { useEffect, useState, useCallback } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/adminService";
import Loader from "../../components/common/Loader";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Order Management</h1>

      <div className="bg-white border border-sage rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-sage/20 text-dark text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-sage/50">
                <td className="p-3">#{order._id.slice(-6).toUpperCase()}</td>
                <td className="p-3">{order.user?.name || "Unknown"}</td>
                <td className="p-3">${order.totalAmount.toFixed(2)}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-sage rounded px-2 py-1 capitalize"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}