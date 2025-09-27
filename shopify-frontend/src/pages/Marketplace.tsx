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
import { Input } from "@/components/ui/input";

export interface ProductProps {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  vendorId: string;
  id: string;
  createdAt: Date;
  vendor?: {
    slug: string;
    name: string;
  };
  imageUrl?: string;
}

export default function Marketplace() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await client.get("/product");
        const allProducts = response.data;
        setProducts(allProducts);
        
        // Select featured products (newest products with stock > 0)
        const available = allProducts.filter((p: ProductProps) => p.stock > 0);
        const sorted = [...available].sort((a: ProductProps, b: ProductProps) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeaturedProducts(sorted.slice(0, 3));
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products from our curated collection of vendors
          </p>

          {/* Featured Products Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Featured Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link 
                  to={`/product/${product.id}`}
                  key={`featured-${product.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-indigo-300 text-5xl">✨</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-indigo-600 font-bold mt-1">
                        ₹ {(product.price / 100).toFixed(2)}
                      </p>
                      {product.vendor && (
                        <p className="text-xs text-gray-500 mt-1">
                          by {product.vendor.name}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>


          {/* Search Bar */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products or vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              No products found
            </h3>
            <p className="text-gray-600 text-lg">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No products available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-2xl group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                {/* Product Image */}
                <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-gray-400 text-6xl group-hover:scale-110 transition-transform duration-300">
                      📦
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ₹ {(product.price / 100).toFixed(2)}
                    </p>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {product.stock} left
                    </span>
                  </div>

                  {product.vendor && (
                    <Link
                      to={`/store/${product.vendor.slug}`}
                      className="text-sm text-gray-500 hover:text-indigo-600 hover:underline transition-colors flex items-center gap-1 mb-2"
                    >
                      <span className="text-xs">🏪</span>
                      by {product.vendor.name}
                    </Link>
                  )}

                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </CardContent>

                {/* Card Actions */}
                <CardFooter className="flex gap-3 pt-4">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                    >
                      View Details
                    </Button>
                  </Link>
                  
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={(e) => {
                      e.preventDefault();
                      const cart = JSON.parse(localStorage.getItem("cart") || "{}");
                      cart[product.id] = (cart[product.id] || 0) + 1;
                      localStorage.setItem("cart", JSON.stringify(cart));
                      // Show a quick notification
                      const notification = document.createElement("div");
                      notification.className = "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
                      notification.textContent = `${product.name} added to cart!`;
                      document.body.appendChild(notification);
                      setTimeout(() => {
                        notification.remove();
                      }, 2000);
                    }}
                  >
                    Add to Cart
                  </Button>
                  
                  {/* Vendor Edit Button - Only show for vendor's own products */}
                  {localStorage.getItem("token") && 
                   localStorage.getItem("role") === "VENDOR" && 
                   localStorage.getItem("userId") === product.vendorId && (
                    <Link to={`/vendor/products?edit=${product.id}`} className="flex-1">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        Edit Product
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

      
      </div>
    </div>
  );
}
