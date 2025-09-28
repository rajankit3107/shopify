import { useEffect, useState, useCallback } from "react";
import client, { setAuthToken } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ProductProps } from "./Marketplace";

interface paymentProps {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  receipt: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: paymentProps) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: {
    address: string;
  };
  theme?: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface CartItem extends ProductProps {
  quantity: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const loadCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("id");
      const cartKey = userId ? `cart_${userId}` : "cart";
      const cartData = JSON.parse(localStorage.getItem(cartKey) || "{}");
      const productIds = Object.keys(cartData);

      if (productIds.length === 0) {
        navigate("/cart");
        return;
      }

      const products = await Promise.all(
        productIds.map(async (id) => {
          const response = await client.get(`/product/${id}`);
          return {
            ...response.data,
            quantity: cartData[id],
          };
        })
      );

      setCartItems(products);
    } catch {
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }
    setAuthToken(token);
    loadCartItems();
  }, [navigate, loadCartItems]);

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const required = ["name", "email", "address", "city", "pincode", "phone"];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        setError(`Please fill in ${field}`);
        return false;
      }
    }
    return true;
  };

  const pay = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);
      setError("");

      const userId = localStorage.getItem("id");
      const cartKey = userId ? `cart_${userId}` : "cart";
      const cartData = JSON.parse(localStorage.getItem(cartKey) || "{}");
      const productIds = Object.keys(cartData);

      if (productIds.length === 0) {
        throw new Error("Cart is empty");
      }

      // Get vendor ID from first product
      const firstProduct = cartItems[0];
      const vendorId = firstProduct.vendorId;

      // Prepare items for order
      const items = productIds.map((id) => ({
        productId: id,
        quantity: cartData[id],
      }));

      const res = await client.post("/orders", {
        vendorId,
        items,
        shippingInfo,
      });

      const { order, razorpay } = res.data;

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: razorpay.key_id,
          amount: razorpay.amount,
          currency: razorpay.currency,
          order_id: razorpay.id,
          name: "Shopifyy",
          description: `Order for ${getTotalItems()} items`,
          prefill: {
            name: shippingInfo.name,
            email: shippingInfo.email,
            contact: shippingInfo.phone,
          },
          handler: async (response: paymentProps) => {
            try {
              await client.post("/payments/callback", {
                receipt: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              // Clear user-specific cart
              const userId = localStorage.getItem("userId");
              const cartKey = userId ? `cart_${userId}` : "cart";
              localStorage.removeItem(cartKey);
              alert("Payment successful! Your order has been placed.");
              navigate("/");
            } catch (error) {
              console.error("Payment verification error:", error);
              alert("Payment verification failed. Please contact support.");
            }
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
            },
          },
        };
        const rz = new (
          window as unknown as {
            Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
          }
        ).Razorpay(options);
        rz.open();
      };
      document.body.appendChild(script);
    } catch (err: unknown) {
      setError(
        (
          err as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
          (
            err as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          )?.message ||
          "Payment failed"
      );
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      value={shippingInfo.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <Input
                    value={shippingInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <Input
                      value={shippingInfo.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <Input
                      value={shippingInfo.pincode}
                      onChange={(e) =>
                        handleInputChange("pincode", e.target.value)
                      }
                      placeholder="Enter pincode"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="text-gray-400 text-lg">📦</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          ₹ {((item.price * item.quantity) / 100).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span>₹ {(getTotalPrice() / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹ {(getTotalPrice() / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={pay}
                    className="w-full mt-6"
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Pay with Razorpay"}
                  </Button>

                  <Link to="/cart" className="block">
                    <Button variant="outline" className="w-full">
                      Back to Cart
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
