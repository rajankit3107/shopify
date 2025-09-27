import { useEffect, useState } from "react";
import client from "../api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface StoreProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
  ownerId: string;
  payoutBalance: number;
  _count: {
    products: number;
  };
}

export default function Stores() {
  const [stores, setStores] = useState<StoreProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await client.get("/vendors");
        // Ensure the response has the expected structure
        const storesData = Array.isArray(response.data) ? response.data : [];
        setStores(storesData);
      } catch (err: unknown) {
        console.error("Error fetching stores:", err);
        setError(
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to fetch stores"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Stores</h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover amazing stores and their unique products
          </p>

          {/* Search Bar */}
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">🏪</div>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              {searchTerm ? "No stores found" : "No stores available yet"}
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Be the first to create a store and start selling!"}
            </p>
            {!searchTerm && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Want to create a store? Sign up as a vendor to get started.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      Sign Up as Vendor
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store) => (
              <Card
                key={store.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 rounded-lg group"
              >
                {/* Store Logo */}
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {store.logoUrl ? (
                    <img
                      src={store.logoUrl}
                      alt={store.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-400 text-6xl">🏪</div>
                  )}
                </div>

                {/* Store Info */}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {store.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-2">
                  {store.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {store.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{store._count?.products || 0} products</span>
                    <span>
                      Joined{" "}
                      {store.createdAt
                        ? new Date(store.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                </CardContent>

                {/* Card Actions */}
                <CardContent className="pt-0">
                  <Link to={`/store/${store.slug}`} className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Visit Store
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
