import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import client, { setAuthToken } from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  totalAmount: number;
  platformFee: number;
  vendorAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  items: OrderItem[];
  customer: {
    id: string;
    email: string;
  };
  createdAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export default function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "all" | "PENDING" | "PAID" | "CANCELLED"
  >("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthToken(token);
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await client.get("/orders/vendor/me");
      setOrders(response.data);
    } catch (err: unknown) {
      console.error("Error fetching orders:", err);
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(
    (order) => filter === "all" || order.status === filter
  );

  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });

  const totalEarnings = orders
    .filter((order) => order.status === "PAID")
    .reduce((sum, order) => sum + order.vendorAmount, 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;
  const paidOrders = orders.filter((order) => order.status === "PAID").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-gray-600 text-lg">Track and manage your orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currency.format(totalEarnings / 100)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 flex items-center">
              <Package className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingOrders}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Completed Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">{paidOrders}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "PENDING", "PAID", "CANCELLED"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  : ""
              }
            >
              {f === "all" ? "All Orders" : f}
            </Button>
          ))}
        </div>

        {/* Orders */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 m-4 rounded-md text-sm">
                {error}
              </div>
            )}

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {filter === "all"
                    ? "No orders yet"
                    : `No ${filter.toLowerCase()} orders`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === "all"
                    ? "Your orders will appear here once customers start buying your products."
                    : `No orders with ${filter.toLowerCase()} status found.`}
                </p>
                <Link to="/vendor/products">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Go to Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {filteredOrders.map((order, idx) => (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-gray-50 transition-all duration-300"
                    style={{
                      animation: "fadeInUp 0.4s ease-out forwards",
                      animationDelay: `${idx * 100}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id.slice(-8)}
                          </h3>
                          <Badge
                            className={`rounded-full px-3 py-1 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </Badge>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Customer
                            </p>
                            <p className="font-medium text-gray-900">
                              {order.customer.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Order Date
                            </p>
                            <p className="font-medium text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Total Amount
                            </p>
                            <p className="font-medium text-gray-900">
                              {currency.format(order.totalAmount / 100)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Your Earnings
                            </p>
                            <p className="font-medium text-green-600">
                              {currency.format(order.vendorAmount / 100)}
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Order Items
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-medium text-gray-900">
                                  {currency.format(item.price / 100)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Razorpay Info */}
                        {order.razorpayOrderId && (
                          <div className="text-sm text-gray-500">
                            <p>Razorpay Order ID: {order.razorpayOrderId}</p>
                            {order.razorpayPaymentId && (
                              <p>Payment ID: {order.razorpayPaymentId}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
