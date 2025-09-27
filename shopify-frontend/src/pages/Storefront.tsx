import client from "../api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchVendor = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await client.get(`/vendors/${slug}`);
        setVendor(response.data);
      } catch (err: unknown) {
        console.error("Error fetching vendor:", err);
        const errorMessage =
          (
            err as {
              response?: { status?: number; data?: { message?: string } };
            }
          )?.response?.status === 404
            ? "Store not found. This store may not exist or may have been removed."
            : (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message || "Failed to load store";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Store not found
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "The store you're looking for doesn't exist."}
          </p>
          <Link to="/">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Store Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{vendor.name}</span>
          </nav>

          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                {/* Store Logo */}
                <div className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                  {vendor.logoUrl ? (
                    <img
                      src={vendor.logoUrl}
                      alt={vendor.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-3xl">🏪</div>
                  )}
                </div>

                {/* Store Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vendor.name}
                  </h1>
                  {vendor.description && (
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">
                      {vendor.description}
                    </p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>{vendor.products.length} products</span>
                    <span>•</span>
                    <span>
                      Joined {new Date(vendor.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <span className="text-gray-500">
              {vendor.products.length} items
            </span>
          </div>

          {vendor.products.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products yet
                </h3>
                <p className="text-gray-600">
                  This store hasn't added any products yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendor.products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 rounded-lg group"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-gray-400 text-4xl">📦</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-2xl font-bold text-indigo-600">
                        ₹ {(product.price / 100).toFixed(2)}
                      </p>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>

                    {product.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </CardContent>

                  {/* Card Actions */}
                  <CardContent className="pt-0">
                    <Link to={`/product/${product.id}`} className="block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? "Out of Stock" : "View Details"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
