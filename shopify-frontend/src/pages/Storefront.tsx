import client from "@/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ProductProps } from "./Marketplace";

export interface vendorProps {
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  id: string;
  createdAt: Date;
  ownerId: string;
  payoutBalance: number;
  products: ProductProps[];
}

export default function Storefront() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState<vendorProps | null>(null);

  useEffect(() => {
    if (!slug) return;
    client
      .get(`/vendor/${slug}`)
      .then((res) => setVendor(res.data))
      .catch(console.error);
  }, [slug]);

  if (!vendor) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl">{vendor.name}</h2>
      <p>{vendor.description}</p>
      <div className="grid grid-cols-3 gap-4">
        {vendor.products.map((p) => (
          <div key={p.id} className="border p-4 rounded bg-white">
            <h4>{p.name}</h4>
            <p>₹ {p.price / 100}.toFixed(2)</p>
            <Link to={`/product/${p.id}`} className="text-indigo-600 text-sm">
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
