import { createContext, useState, useEffect, useCallback } from "react";
import {
  getWishlist as fetchWishlist,
  addToWishlist as addItem,
  removeFromWishlist as removeItem,
} from "../services/wishlistService";
import { useAuth } from "../hooks/useauth";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await fetchWishlist();
      setWishlist(data);
    } catch (err) {
      // silently ignore
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [user, refreshWishlist]);

  const addToWishlist = useCallback(async (productId) => {
    const data = await addItem(productId);
    setWishlist(data);
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    const data = await removeItem(productId);
    setWishlist(data);
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.products.some((p) => p._id === productId),
    [wishlist.products]
  );

  return (
    <WishlistContext.Provider
      value={{ wishlist, isLoading, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}