import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { name: "Cart", path: "/cart" },
    { name: "Vendor", path: "/vendor/dashboard" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 hover:text-gray-900 transition-colors"
        >
          Shopifyy
        </Link>

        <nav className="flex items-center gap-6 text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-gray-900 hover:underline underline-offset-4 transition-all ${
                location.pathname === link.path ? "text-gray-900 underline" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button className="cursor-pointer" variant="outline">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="cursor-pointer">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
