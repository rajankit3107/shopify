import { useEffect, useState } from "react";
import client from "../api";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number; // in paise
  vendor?: {
    slug: string;
    name: string;
  };
  imageUrl?: string;
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    client
      .get("/product")
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="py-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card
            key={p.id}
            className="overflow-hidden hover:shadow-lg transition rounded-lg"
          >
            {/* Product Image */}
            <div className="h-44 bg-gray-100 flex items-center justify-center">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>

            {/* Product Name */}
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{p.name}</CardTitle>
            </CardHeader>

            {/* Product Price & Vendor */}
            <CardContent>
              <p className="text-indigo-600 font-medium text-lg">
                ₹ {(p.price / 100).toFixed(2)}
              </p>
              {p.vendor && (
                <Link
                  to={`/store/${p.vendor.slug}`}
                  className="text-sm text-gray-500 hover:underline"
                >
                  by {p.vendor.name}
                </Link>
              )}
            </CardContent>

            {/* Card Actions */}
            <CardFooter className="flex justify-between">
              <Link to={`/product/${p.id}`}>
                <Button className="cursor-pointer" variant="outline" size="sm">
                  View
                </Button>
              </Link>
              <Button className="cursor-pointer" size="sm">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
