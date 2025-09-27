import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { to: "/cart", label: "Cart" },
    { to: "/vendor/dashboard", label: "Vendor" },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 hover:text-gray-900"
        >
          Shopify
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-gray-600 relative">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <div key={link.to} className="relative">
                <Link to={link.to} className="hover:text-gray-900">
                  {link.label}
                </Link>
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
