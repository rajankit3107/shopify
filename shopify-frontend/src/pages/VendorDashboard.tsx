import { useEffect, useState } from "react";
import client from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface OrderProps {
  id: string;
  customerId: string;
  vendorId: string;
  total: number;
  platformFee: number;
  vendorAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (token) {
          client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const response = await client.get("/orders/vendor/me");
        setOrders(response.data);
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Vendor Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Manage your orders, track sales, and grow your business
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/vendor/products">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 text-lg">
                Manage Products
              </Button>
            </Link>
            <Link to="/vendor/orders">
              <Button variant="outline" className="px-6 py-3 text-lg">
                View Orders
              </Button>
            </Link>
            <Link to="/vendor/analytics">
              <Button variant="outline" className="px-6 py-3 text-lg">
                View Analytics
              </Button>
            </Link>
            <Link to="/vendor/create">
              <Button variant="outline" className="px-6 py-3 text-lg">
                Create Store
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold mb-2">{orders.length}</div>
                  <p className="text-indigo-100 text-lg">Total Orders</p>
                </div>
                <div className="text-6xl opacity-20">📦</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    ₹{" "}
                    {orders.reduce(
                      (sum, order) => sum + order.vendorAmount,
                      0
                    ) / 100}
                  </div>
                  <p className="text-green-100 text-lg">Total Earnings</p>
                </div>
                <div className="text-6xl opacity-20">💰</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {
                      orders.filter((order) => order.status === "PENDING")
                        .length
                    }
                  </div>
                  <p className="text-yellow-100 text-lg">Pending Orders</p>
                </div>
                <div className="text-6xl opacity-20">⏳</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-8xl mb-6">📦</div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Your orders will appear here once customers start buying your
                  products.
                </p>
                <Link to="/">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 text-lg">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Order #{order.id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₹ {(order.vendorAmount / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Platform fee: ₹ {(order.platformFee / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
