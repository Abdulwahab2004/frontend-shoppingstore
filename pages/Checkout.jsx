import { useMemo, useState } from "react";
import { useCart } from "../hooks/useCart";
import { createCheckoutSession } from "../services/paymentService";
import Button from "../components/common/Button";

export default function Checkout() {
  const { cart } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(() => {
    return cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  }, [cart.items]);

  const handleCheckout = async () => {
    setError("");
    setIsRedirecting(true);
    try {
      const data = await createCheckoutSession();
      window.location.href = data.url; // send the browser to Stripe's hosted page
    } catch (err) {
      setError("Failed to start checkout. Please try again.");
      setIsRedirecting(false);
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

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <Button onClick={handleCheckout} isLoading={isRedirecting} fullWidth>
        Pay with Stripe
      </Button>
    </section>
  );
}