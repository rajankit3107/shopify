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

interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  payoutBalance: number;
  createdAt: string;
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (token) {
          client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        const vendorResponse = await client.get("/vendors/me");
        setVendor(vendorResponse.data);

        const ordersResponse = await client.get("/orders/vendor/me");
        setOrders(ordersResponse.data);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to fetch data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes("create a store first")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="text-center px-6">
          <div className="text-gray-400 text-9xl mb-6">🏪</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Your Vendor Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            To get started, create your store. Then you can add products, manage orders, and track sales.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/vendor/create">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-4 text-lg">
                Create Your Store
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="px-6 py-3 text-lg">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {vendor ? `${vendor.name} Dashboard` : "Vendor Dashboard"}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {vendor
              ? "Manage your orders, track earnings, and grow your business."
              : "Manage your orders, track earnings, and grow your business."}
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
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
          </div>
        </div>

        {/* Vendor Info */}
        {vendor && (
          <Card className="mb-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-0">
            <CardContent className="flex flex-col md:flex-row items-center gap-6 p-8">
              <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                {vendor.logoUrl ? (
                  <img
                    src={vendor.logoUrl}
                    alt={vendor.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-gray-400 text-3xl">🏪</div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{vendor.name}</h2>
                {vendor.description && (
                  <p className="text-gray-600 mb-2">{vendor.description}</p>
                )}
                <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
                  <span>URL: shopifyy.com/store/{vendor.slug}</span>
                  <span>•</span>
                  <span>Payout: ₹{(vendor.payoutBalance / 100).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <DashboardCard
            colorFrom="from-indigo-500"
            colorTo="to-indigo-600"
            count={orders.length}
            label="Total Orders"
            icon="📦"
          />
          <DashboardCard
            colorFrom="from-green-500"
            colorTo="to-green-600"
            count={orders.reduce((sum, o) => sum + o.vendorAmount, 0) / 100}
            label="Total Earnings"
            icon="💰"
          />
          <DashboardCard
            colorFrom="from-yellow-500"
            colorTo="to-orange-500"
            count={orders.filter((o) => o.status === "PENDING").length}
            label="Pending Orders"
            icon="⏳"
          />
        </div>

        {/* Orders Table */}
        <Card className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-0">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-9xl mb-6">📦</div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">No orders yet</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Orders will appear here once customers buy your products.
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
                    className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 transition-colors gap-4"
                  >
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-medium text-gray-900 mb-1">Order #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        ₹ {(order.vendorAmount / 100).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Platform fee: ₹ {(order.platformFee / 100).toFixed(2)}
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

function DashboardCard({
  colorFrom,
  colorTo,
  count,
  label,
  icon,
}: {
  colorFrom: string;
  colorTo: string;
  count: number | string;
  label: string;
  icon: string;
}) {
  return (
    <Card
      className={`bg-gradient-to-br ${colorFrom} ${colorTo} text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
    >
      <CardContent className="p-8 flex items-center justify-between">
        <div>
          <div className="text-4xl font-bold mb-2">{count}</div>
          <p className="text-lg font-medium">{label}</p>
        </div>
        <div className="text-6xl opacity-20">{icon}</div>
      </CardContent>
    </Card>
  );
}
