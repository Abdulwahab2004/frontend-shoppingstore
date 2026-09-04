import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Download, ShoppingBag, ArrowRight } from "lucide-react";
import { getMyOrders } from "../services/orderService";
import { API_BASE_URL } from "../utils/constant";
import Loader from "../components/common/Loader";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Package size={22} className="text-fern" />
        <h1 className="text-2xl font-bold text-dark">Order History</h1>
        {!error && orders.length > 0 && (
          <span className="text-sm text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {orders.length}
          </span>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!error && orders.length === 0 && (
        <div className="text-center py-20 bg-white border border-dashed border-sage rounded-xl">
          <ShoppingBag size={40} className="mx-auto text-sage mb-3" />
          <p className="text-dark font-medium mb-1">No orders yet</p>
          <p className="text-forest text-sm mb-5">
            You have not placed any orders yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 bg-fern text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-forest transition-all duration-200 hover:gap-2.5"
          >
            Browse Products
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-sage/60 rounded-xl p-5 transition-shadow duration-200 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-dark font-medium font-mono text-sm">
                  #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-forest mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                  STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-sage/40">
              <div>
                <p className="text-xs text-forest">Total</p>
                <p className="text-lg font-bold text-dark">${order.totalAmount.toFixed(2)}</p>
              </div>

              <a
                href={`${API_BASE_URL}/orders/${order._id}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-fern text-sm font-medium px-3 py-1.5 rounded-lg border border-fern/30 hover:bg-fern/10 transition-colors duration-200"
              >
                <Download size={14} />
                Invoice
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}