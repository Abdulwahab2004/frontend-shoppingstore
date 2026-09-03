import { useEffect, useState } from "react";
import { X, Package } from "lucide-react";
import { getOrderByIdAdmin } from "../../services/adminService";
import Loader from "../../components/common/Loader";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderDetailModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderByIdAdmin(orderId);
        setOrder(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-fern/15 text-fern flex items-center justify-center">
              <Package size={18} />
            </div>
            <h2 className="text-lg font-bold text-dark">Order Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-forest hover:bg-sage/20 hover:text-dark transition-colors duration-200"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <Loader />
        ) : !order ? (
          <p className="text-red-600 text-sm">Order not found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
              <div>
                <p className="text-forest text-xs mb-0.5">Order ID</p>
                <p className="font-mono text-dark">#{order._id.slice(-6).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-forest text-xs mb-0.5">Status</p>
                <span
                  className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-forest text-xs mb-0.5">Customer</p>
                <p className="text-dark">{order.user?.name || "Unknown"}</p>
                <p className="text-xs text-forest">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-forest text-xs mb-0.5">Date</p>
                <p className="text-dark">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="mb-5 text-sm">
                <p className="text-forest text-xs mb-1">Shipping Address</p>
                <p className="text-dark">
                  {order.shippingAddress.fullName}, {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city} {order.shippingAddress.postalCode}
                </p>
                <p className="text-dark">{order.shippingAddress.phone}</p>
              </div>
            )}

            <p className="text-forest text-xs mb-2">Items</p>
            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-sage/10 rounded-lg p-2"
                >
                  <img
                    src={item.product?.images?.[0] || "https://via.placeholder.com/50"}
                    alt={item.product?.name}
                    className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark truncate">
                      {item.product?.name || "Product removed"}
                    </p>
                    <p className="text-xs text-forest">
                      Qty {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-dark">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-sage/40">
              <span className="text-sm font-medium text-dark">Total</span>
              <span className="text-lg font-bold text-dark">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}