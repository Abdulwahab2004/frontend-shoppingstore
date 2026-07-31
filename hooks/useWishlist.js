import { useContext } from "react";
import { WishlistContext } from "../Context/WishlistContext";

export function useWishlist() {
  return useContext(WishlistContext);
}