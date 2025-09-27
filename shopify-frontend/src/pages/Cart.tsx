import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductProps } from "./Marketplace";

export default function Cart() {
  const [items, setItems] = useState<ProductProps[]>([]);
  const navigate = useNavigate();
  useEffect(
    () => setItems(JSON.parse(localStorage.getItem("cart") || "[]")),
    []
  );
  function checkout() {
    if (!items.length) return alert("Cart empty");
    navigate("/checkout");
  }
  return (
    <div>
      <h2 className="text-2xl mb-4">Cart</h2>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 bg-white border rounded">
            Product: {it.id} • Qty: {it.stock}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={checkout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
