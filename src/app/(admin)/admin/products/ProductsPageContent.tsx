"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductListItem } from "./ProductListItem";
import { MobileProductCard } from "./MobileProductCard";

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API route
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/admin/products", {
          cache: 'no-store',
        });
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        } else {
          console.error("API Error:", result.error);
          setError(result.error);
        }
      } catch (error: any) {
        console.error("Fetch error:", error);
        setError(error.message || "Failed to load products");
        toast.error("Failed to load products. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Show toast notifications from URL params
  useEffect(() => {
    const success = searchParams.get("success");
    const urlError = searchParams.get("error");

    if (success) {
      toast.success(success);
      window.history.replaceState({}, "", "/admin/products");
    }
    if (urlError) {
      toast.error(urlError);
      window.history.replaceState({}, "", "/admin/products");
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading products...
            </p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Failed to Load Products</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-green-500 text-black hover:bg-green-600"
            >
              Retry
            </Button>
          </div>
        </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button className="bg-green-500 text-black hover:bg-green-600">
            Add New Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No products found
          </p>
          <Link href="/admin/products/new">
            <Button className="bg-green-500 text-black hover:bg-green-600">
              Add Your First Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4">
            {products.map((product) => (
              <MobileProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop Table View */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
