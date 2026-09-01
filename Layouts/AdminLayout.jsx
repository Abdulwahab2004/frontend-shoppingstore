import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Products", path: "/admin/products" },
  { name: "Categories", path: "/admin/categories" },
  { name: "Orders", path: "/admin/orders" },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#f7f7f2]">
      <aside className="w-56 bg-dark text-white flex-shrink-0 hidden md:block">
        <div className="p-4 text-xl font-bold text-sage">Admin Panel</div>
        <nav className="flex flex-col">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-3 hover:bg-forest transition-colors duration-200 ${
                location.pathname === link.path ? "bg-forest" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark text-white flex justify-around py-2 z-50">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-xs px-2 ${
              location.pathname === link.path ? "text-sage" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-[1440px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}