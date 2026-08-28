import { useState } from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/constant";
import { useAuth } from "../../hooks/useauth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const links = user
    ? [
        { name: "Categories", path: "/categories" },
        { name: "Products", path: "/products" },
        { name: "Dashboard", path: "/dashboard" },
         { name: "Cart", path: "/cart" },
         { name: "Wishlist", path: "/wishlist" },
         { name: "Orders", path: "/orders" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Categories", path: "/categories" },
        { name: "Products", path: "/products" },
        { name: "Login", path: "/login" },
        { name: "Signup", path: "/signup" },
       
      ];

  return (
    <nav className="bg-dark text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-sage">
          {APP_NAME}
        </Link>

        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className="hover:text-sage">
              {link.name}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="hover:text-sage"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}