import { useEffect, useState, useCallback, useMemo } from "react";
import { Package, Search } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "../../services/adminService";
import Loader from "../../components/common/Loader";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

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
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o._id.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Package size={22} className="text-fern" />
          <h1 className="text-2xl font-bold text-dark">Order Management</h1>
          <span className="text-sm text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or order ID..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-sage outline-none focus:border-fern transition-colors duration-200"
          />
        </div>
      </div>

      <div className="bg-white border border-sage/60 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-sage/20 text-dark text-left">
            <tr>
              <th className="p-3 font-medium">Order ID</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-forest">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-sage/40 hover:bg-sage/10 transition-colors duration-150"
                >
                  <td className="p-3 font-mono text-xs text-dark">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="p-3">
                    <p className="text-dark">{order.user?.name || "Unknown"}</p>
                    {order.user?.email && (
                      <p className="text-xs text-forest">{order.user.email}</p>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-dark">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                          STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="text-xs border border-sage rounded-md px-2 py-1 capitalize outline-none focus:border-fern disabled:opacity-50 transition-colors duration-200"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-3 text-forest">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}