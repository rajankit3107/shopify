import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { setAuthToken } from "../api";
import { Menu } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setAuthToken(token);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserRole(null);
    setAuthToken("");
    navigate("/");
  };

  const navLinks = [
    { name: "Marketplace", path: "/" },
    { name: "Stores", path: "/stores" },
    { name: "Cart", path: "/cart" },
  ];

  if (userRole === "VENDOR") {
    navLinks.push(
      { name: "Dashboard", path: "/vendor/dashboard" },
      { name: "Create Store", path: "/vendor/create" },
      { name: "Products", path: "/vendor/products" },
      { name: "Orders", path: "/vendor/orders" },
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-700 transition-colors"
        >
          Shopify
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path}>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                }`}
              >
                {link.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                <div className="w-7 h-7 bg-indigo-200 rounded-full flex items-center justify-center text-sm font-bold text-indigo-700">
                  {userRole?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium capitalize text-indigo-700">
                  {userRole?.toLowerCase()}
                </span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
