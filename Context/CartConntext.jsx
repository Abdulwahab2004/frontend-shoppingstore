import { createContext, useState, useEffect } from "react";
import { getCart as fetchCart, addToCart as addItem } from "../services/cartService";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      // silently ignore — cart just stays empty
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const data = await addItem(productId, quantity);
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, refreshCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}