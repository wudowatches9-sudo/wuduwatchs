"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductForm from "./ProductForm";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/admin/products/${slug}`, {
          cache: 'no-store',
        });
        
        const result = await response.json();
        
        if (result.success) {
          setProduct(result.data);
          setIsNew(result.isNew || false);
        } else {
          setError(result.error || "Failed to load product");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading product...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Failed to Load Product</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 text-black hover:bg-green-600 px-4 py-2 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render form only when data is loaded
  return (
    <div className="p-6">
      <ProductForm product={product} />
    </div>
  );
}