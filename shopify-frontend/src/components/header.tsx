import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { setAuthToken } from "../api";
import { Menu } from "lucide-react";

export default function Header() {
  const location = useLocation();
 
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
    localStorage.removeItem("id");
    setIsAuthenticated(false);
    setUserRole(null);
    setAuthToken("");
    window.location.href = "/";
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
      { name: "Orders", path: "/vendor/orders" }
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm shadow-sm w-full">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-700 transition-colors"
          >
            Shopify
          </Link>
        </div>

        {/* Center Section - Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    location.pathname === link.path
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Right Section - Auth */}
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
            <div className="flex items-center gap-2">
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
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 ml-2">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}