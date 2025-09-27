import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { setAuthToken } from "../api";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setAuthToken(token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
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
    navLinks.push({ name: "Dashboard", path: "/vendor/dashboard" });
    navLinks.push({ name: "Products", path: "/vendor/products" });
    navLinks.push({ name: "Orders", path: "/vendor/orders" });
    navLinks.push({ name: "Analytics", path: "/vendor/analytics" });
    navLinks.push({ name: "Create Store", path: "/vendor/create" });
  }

  return (
    <header className="shadow-lg sticky top-0 z-50 border-b backdrop-blur-sm bg-white/95">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Shopifyy
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-gray-900 hover:underline underline-offset-4 transition-all font-medium ${
                location.pathname === link.path
                  ? "text-indigo-600 underline"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">
                    {userRole?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {userRole?.toLowerCase()}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button className="cursor-pointer" variant="outline">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="cursor-pointer">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
