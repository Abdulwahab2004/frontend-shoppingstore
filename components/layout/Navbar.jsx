import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Package,
  LayoutDashboard,
  ShieldCheck,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { APP_NAME } from "../../utils/constant";
import { useAuth } from "../../hooks/useauth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  const cartCount = cart?.items?.length || 0;
  const wishlistCount = wishlist?.products?.length || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = user
    ? [
        { name: "Categories", path: "/categories", icon: LayoutGrid },
        { name: "Products", path: "/products", icon: ShoppingBag },
        { name: "Orders", path: "/orders", icon: Package },
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        ...(user.role === "admin"
          ? [{ name: "Admin", path: "/admin", icon: ShieldCheck }]
          : []),
          { name: "", path: "/cart", icon: ShoppingCart, badge: cartCount },
          { name: "", path: "/wishlist", icon: Heart, badge: wishlistCount },
      ]
    : [
        { name: "Home", path: "/", icon: Home },
        { name: "Categories", path: "/categories", icon: LayoutGrid },
        { name: "Products", path: "/products", icon: ShoppingBag },
        { name: "Login", path: "/login", icon: LogIn },
        { name: "Signup", path: "/signup", icon: UserPlus },
      ];

  return (
    <nav
      className={`sticky top-0 z-50 text-white transition-all duration-300 ${
        scrolled ? "bg-dark/95 backdrop-blur-sm shadow-lg" : "bg-dark"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-sage tracking-tight hover:opacity-90 transition-opacity duration-200"
        >
          {APP_NAME}
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                  isActive ? "text-sage" : "text-white/90 hover:text-sage"
                }`}
              >
                <Icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
                {link.name}
                {!!link.badge && (
                  <span className="absolute -top-1 -right-1 bg-fern text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
                <span
                  className={`absolute left-3 right-3 -bottom-0.5 h-0.5 bg-sage rounded-full origin-left transition-transform duration-200 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <button
          className="md:hidden p-1 text-white hover:text-sage transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 pb-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive ? "bg-forest text-sage" : "text-white/90 hover:bg-forest/60"
                }`}
              >
                <Icon size={18} />
                {link.name}
                {!!link.badge && (
                  <span className="ml-auto bg-fern text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}