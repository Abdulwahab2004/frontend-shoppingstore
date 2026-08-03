import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import Loader from "../components/common/Loader";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) return <Loader />;
  if (!order) return <p className="text-center py-16 text-red-600">Order not found</p>;

  return (
    <section className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white border border-sage rounded-lg p-6">
        <h1 className="text-2xl font-bold text-dark mb-2">Order Confirmed!</h1>
        <p className="text-forest mb-4">
          Order #{order._id.slice(-6).toUpperCase()} has been placed.
        </p>
        <p className="text-dark font-semibold mb-6">
          Total: ${order.totalAmount.toFixed(2)}
        </p>
        <Link to="/products" className="text-fern font-medium hover:underline">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}