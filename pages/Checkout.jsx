import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Lock, ArrowRight } from "lucide-react";
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

  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  const handleCheckout = async () => {
    setError("");
    setIsRedirecting(true);
    try {
      const data = await createCheckoutSession();
      window.location.href = data.url;
    } catch (err) {
      setError("Failed to start checkout. Please try again.");
      setIsRedirecting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <section className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingBag size={40} className="mx-auto text-sage mb-3" />
        <p className="text-dark font-medium mb-1">Your cart is empty</p>
        <p className="text-forest text-sm mb-5">Add something to your cart before checking out.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 bg-fern text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-forest transition-all duration-200 hover:gap-2.5"
        >
          Browse Products
          <ArrowRight size={16} />
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-dark mb-6">Checkout</h1>

      <div className="bg-white border border-sage/60 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-dark">Order Summary</h2>
          <span className="text-xs text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="space-y-3 mb-3">
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex items-center gap-3">
              <img
                src={item.product.images?.[0] || "https://via.placeholder.com/50"}
                alt={item.product.name}
                className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark truncate">{item.product.name}</p>
                <p className="text-xs text-forest">Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-medium text-dark">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-sage/40">
          <span className="text-sm text-forest">Total</span>
          <span className="text-xl font-bold text-dark">${total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <Button onClick={handleCheckout} isLoading={isRedirecting} fullWidth>
        <span className="flex items-center justify-center gap-2">
          <Lock size={15} />
          Pay with Stripe
        </span>
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-forest">
        <ShieldCheck size={14} className="text-fern" />
        Secure payment powered by Stripe
      </div>
    </section>
  );
}