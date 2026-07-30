import { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { updateCartItem, removeFromCart } from "../services/cartService";
import CartItem from "../components/products/Cartitem";
import Loader from "../components/common/Loader";

export default function Cart() {
  const { cart, isLoading, setCart } = useCart();

  const handleUpdateQuantity = useCallback(
    async (productId, quantity) => {
      const data = await updateCartItem(productId, quantity);
      setCart(data);
    },
    [setCart]
  );

  const handleRemove = useCallback(
    async (productId) => {
      const data = await removeFromCart(productId);
      setCart(data);
    },
    [setCart]
  );

  const total = useMemo(() => {
    return cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  }, [cart.items]);

  if (isLoading) return <Loader />;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-dark mb-6">Your Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-forest mb-4">Your cart is empty.</p>
          <Link to="/products" className="text-fern font-medium hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="bg-white border border-sage rounded-lg p-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-dark">
              Total: ${total.toFixed(2)}
            </span>
            <Link
              to="/checkout"
              className="bg-fern text-white px-6 py-2 rounded-lg font-medium hover:bg-forest transition-colors duration-200"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
}