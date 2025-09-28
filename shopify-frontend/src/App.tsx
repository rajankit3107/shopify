import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductPage from "./pages/ProductPage";
import Storefront from "./pages/Storefront";
import VendorDashboard from "./pages/VendorDashboard";
import Stores from "./pages/Stores";
import CreateStore from "./pages/CreateStore";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";
import LandingPage from "./pages/LandingPage";
import { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className={isAuthenticated ? "container mx-auto px-4" : ""}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Marketplace /> : <LandingPage />} />
          <Route path="/marketplace" element={isAuthenticated ? <Marketplace /> : <Navigate to="/" replace />} />
          <Route path="/stores" element={isAuthenticated ? <Stores /> : <Navigate to="/" replace />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
          />
          <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/" replace />} />
          <Route
            path="/checkout"
            element={isAuthenticated ? <Checkout /> : <Navigate to="/" replace />}
          />
          <Route path="/product/:id" element={isAuthenticated ? <ProductPage /> : <Navigate to="/" replace />} />
          <Route path="/store/:slug" element={isAuthenticated ? <Storefront /> : <Navigate to="/" replace />} />
          <Route
            path="/vendor/dashboard"
            element={
              isAuthenticated && userRole === "VENDOR" ? (
                <VendorDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/vendor/create"
            element={
              isAuthenticated && userRole === "VENDOR" ? (
                <CreateStore />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/vendor/products"
            element={
              isAuthenticated && userRole === "VENDOR" ? (
                <ProductManagement />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/vendor/orders"
            element={
              isAuthenticated && userRole === "VENDOR" ? (
                <OrderManagement />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
