import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../Context/Authcontext";
import { CartProvider } from "../Context/CartConntext";
import AppRoutes from "../routes/AppRoutes";
import { WishlistProvider } from "../Context/WishlistContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
          <AppRoutes />
        </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}