import { useContext } from "react";
import { CartContext } from "../Context/CartConntext";

export function useCart() {
  return useContext(CartContext);
}