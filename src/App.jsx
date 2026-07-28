import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../Context/Authcontext";
import { CartProvider } from "../Context/CartConntext";
import AppRoutes from "../routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}