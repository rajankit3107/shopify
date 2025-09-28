import { useNavigate, useParams, Link } from "react-router-dom";
import type { ProductProps } from "./Marketplace";
import { useEffect, useState } from "react";
import client from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await client.get(`/product/${id}`);
        setProduct(response.data);
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const userId = localStorage.getItem("userId");
    console.log((userId))
    const cartKey = userId ? `cart_${userId}` : "cart";
    const cartData = JSON.parse(localStorage.getItem(cartKey) || "{}");
    const currentQuantity = cartData[product.id] || 0;
    cartData[product.id] = currentQuantity + quantity;
    localStorage.setItem(cartKey, JSON.stringify(cartData));

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const goToCart = () => {
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Product not found
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
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
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                  📦
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.vendor && (
                <Link
                  to={`/store/${product.vendor.slug}`}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  by {product.vendor.name}
                </Link>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-indigo-600">
                  ₹ {(product.price / 100).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock} available
                </span>
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-20 text-center"
                      min="1"
                      max={product.stock}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={addToCart}
                    disabled={product.stock === 0}
                    className="flex-1"
                    size="lg"
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button
                    onClick={goToCart}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    View Cart
                  </Button>
                </div>

                {addedToCart && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                    ✓ Added to cart successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Product ID:</span>
                <span className="ml-2 text-gray-600">{product.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Vendor ID:</span>
                <span className="ml-2 text-gray-600">{product.vendorId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Stock:</span>
                <span className="ml-2 text-gray-600">
                  {product.stock} units
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
