import { useEffect } from "react";
import client, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

interface paymentProps {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  receipt: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login");
      navigate("/login");
      return;
    }
    setAuthToken(token);
  }, []);

  async function pay() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!cart.length) throw new Error("Cart empty");
      const vendorId = cart[0].vendorId;
      const res = await client.post("/orders", { vendorId, items: cart });
      const { order, razorpay } = res.data;
      // load checkout script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: razorpay.key_id || (import.meta.env.VITE_RAZORPAY_KEY_ID ?? ""),
          amount: razorpay.amount,
          currency: razorpay.currency,
          order_id: razorpay.id,
          handler: async (response: paymentProps) => {
            await client.post("/payments/callback", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              receipt: order.id,
            });
            localStorage.removeItem("cart");
            alert("Payment success");
            navigate("/");
          },
        };
        const rz = new (window as any).Razorpay(options);
        rz.open();
      };
      document.body.appendChild(script);
    } catch (err: any) {
      alert(err.message || "Payment failed");
    }
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Checkout</h2>
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={pay}
      >
        Pay with Razorpay
      </button>
    </div>
  );
}
