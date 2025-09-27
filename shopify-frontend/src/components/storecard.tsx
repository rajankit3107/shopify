import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface Store {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

interface StoreListProps {
  stores: Store[];
}

export default function StoreList({ stores }: StoreListProps) {
  return (
    <div className="py-12 px-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-gray-900 text-center">
        Our Stores
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stores.map((store) => (
          <Card
            key={store.id}
            className="overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 bg-white"
          >
            {/* Banner Image */}
            <CardHeader className="p-0">
              <div className="h-64 w-full relative overflow-hidden">
                {store.imageUrl ? (
                  <img
                    src={store.imageUrl}
                    alt={store.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-gray-200 h-full">
                    <span className="text-gray-400">No Banner</span>
                  </div>
                )}
              </div>
            </CardHeader>

            {/* Store Info */}
            <CardContent className="text-center px-6 pb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mt-4">
                {store.name}
              </h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {store.description}
              </p>
              <Link
                to={`/store/${store.id}`}
                className="inline-block mt-4 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Visit Store
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
