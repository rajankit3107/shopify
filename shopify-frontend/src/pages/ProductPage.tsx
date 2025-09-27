import { useNavigate, useParams } from "react-router-dom";
import type { ProductProps } from "./Marketplace";
import { useEffect, useState } from "react";
import client from "@/api";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps | null>(null);

  useEffect(() => {
    if (!id) return;

    client
      .get(`/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch(console.error);
  }, [id]);

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      productId: product?.id,
      quantity: 1,
      vendorId: product?.vendorId,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl">{product.name}</h2>
      <p className="text-lg mb-2">₹ {(product.price / 100).toFixed(2)}</p>
      <p className="mb-4">{product.description}</p>
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={addToCart}
      >
        Add to cart
      </button>
    </div>
  );
}
