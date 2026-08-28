import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import { API_BASE_URL } from "../utils/constants";
import Loader from "../components/common/Loader";

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
      <h1 className="text-2xl font-bold text-dark mb-6">Order History</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!error && orders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-forest mb-4">You have not placed any orders yet.</p>
          <Link to="/products" className="text-fern font-medium hover:underline">
            Browse Products
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-sage rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-dark font-medium">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-forest">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-sage/30 text-dark capitalize">
                {order.status}
              </span>
            </div>

            <p className="text-dark font-semibold mb-3">
              Total: ${order.totalAmount.toFixed(2)}
            </p>
<a
            
              href={`${API_BASE_URL}/orders/${order._id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fern text-sm font-medium hover:underline"
            >
              Download Invoice
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}