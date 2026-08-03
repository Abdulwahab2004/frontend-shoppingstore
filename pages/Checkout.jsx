import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../services/orderService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(() => {
    return cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  }, [cart.items]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const order = await createOrder(formData);
      await refreshCart();
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <section className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-forest">Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-dark mb-6">Checkout</h1>

      <div className="bg-white border border-sage rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-dark mb-2">Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.product._id} className="flex justify-between text-sm text-dark py-1">
            <span>{item.product.name} × {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-dark mt-2 pt-2 border-t border-sage">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-sage rounded-lg p-6">
        <h2 className="font-semibold text-dark mb-4">Shipping Address</h2>

        <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
        <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
        <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
        <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Place Order
        </Button>
      </form>
    </section>
  );
}