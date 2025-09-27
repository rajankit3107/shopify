import { useEffect, useState } from "react";
import client from "../api";

export interface OrderProps {
  id: string;
  customerId: string;
  vendorId: string;
  total: number;
  platformFee: number;
  vendorAmount: number;
  status: "PENDING";
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token)
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    client
      .get("/orders/vendor/me")
      .then((r) => setOrders(r.data))
      .catch(console.error);
  }, []);
  return (
    <div>
      <h2 className="text-2xl mb-4">Vendor Dashboard</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="p-3 bg-white border rounded">
            <div>Order: {o.id}</div>
            <div>Total: ₹ {(o.total / 100).toFixed(2)}</div>
            <div>Status: {o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
