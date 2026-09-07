import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../Context/Authcontext";
import { CartProvider } from "../Context/CartConntext";
import AppRoutes from "../routes/AppRoutes";
import { WishlistProvider } from "../Context/WishlistContext";
import { SocketProvider } from "../Context/SocketContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
    <SocketProvider>
        <CartProvider>
          <WishlistProvider>
          <AppRoutes />
        </WishlistProvider>
        </CartProvider>
    </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}