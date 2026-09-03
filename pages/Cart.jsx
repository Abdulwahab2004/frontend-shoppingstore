import { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, ShoppingBag } from "lucide-react";
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

  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  if (isLoading) return <Loader />;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart size={22} className="text-fern" />
        <h1 className="text-2xl font-bold text-dark">Your Cart</h1>
        {cart.items.length > 0 && (
          <span className="text-sm text-forest bg-sage/20 px-2 py-0.5 rounded-full">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-sage rounded-xl">
          <ShoppingBag size={40} className="mx-auto text-sage mb-3" />
          <p className="text-dark font-medium mb-1">Your cart is empty</p>
          <p className="text-forest text-sm mb-5">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 bg-fern text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-forest transition-all duration-200 hover:gap-2.5"
          >
            Browse Products
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {cart.items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="bg-white border border-sage/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-forest">Order Total</p>
              <p className="text-2xl font-bold text-dark">${total.toFixed(2)}</p>
            </div>
            <Link
              to="/checkout"
              className="group inline-flex items-center justify-center gap-2 bg-fern text-white px-6 py-3 rounded-full font-medium hover:bg-forest transition-all duration-200 hover:gap-3"
            >
              Proceed to Checkout
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}