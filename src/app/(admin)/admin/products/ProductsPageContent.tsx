"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "./ProductCard";
import { Search, Plus, Upload, Loader2, RefreshCw } from "lucide-react";

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStock, setSelectedStock] = useState("all");
  const [sortBy, setSortBy] = useState("recently-added");

  // Fetch products from API route
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
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
  };

  useEffect(() => {
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

  // Extract unique categories dynamically from products
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  // Filter & Sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category &&
          product.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      const matchesStock =
        selectedStock === "all" ||
        (selectedStock === "in-stock" && product.stock > 0) ||
        (selectedStock === "out-of-stock" && product.stock <= 0);

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === "recently-added") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateA && dateB) return dateB - dateA;
        return b.id.localeCompare(a.id);
      }
      if (sortBy === "price-low") {
        return a.price - b.price;
      }
      if (sortBy === "price-high") {
        return b.price - a.price;
      }
      if (sortBy === "name-az") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-zinc-400 font-sans text-sm">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-[#12131a] rounded-xl border border-red-900/20 max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-heading font-semibold text-soft-white mb-2">Failed to Load Products</h2>
          <p className="text-zinc-400 text-sm mb-5">{error}</p>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-all mx-auto"
          >
            <RefreshCw size={15} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-soft-white min-h-screen">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Products</h1>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-[#12131a]/60 backdrop-blur-md p-4 rounded-xl border border-zinc-800/40 flex flex-wrap items-center gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-grow min-w-[240px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-lg text-sm text-soft-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 w-full transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-lg text-sm text-soft-white/85 focus:outline-none focus:border-zinc-700 transition-all font-sans cursor-pointer min-w-[150px]"
        >
          <option value="" className="bg-zinc-950 text-soft-white/80">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category} className="bg-zinc-950 text-soft-white/80">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        {/* Stock Status Dropdown */}
        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-lg text-sm text-soft-white/85 focus:outline-none focus:border-zinc-700 transition-all font-sans cursor-pointer min-w-[130px]"
        >
          <option value="all" className="bg-zinc-950 text-soft-white/80">All Stock</option>
          <option value="in-stock" className="bg-zinc-950 text-soft-white/80">In Stock</option>
          <option value="out-of-stock" className="bg-zinc-950 text-soft-white/80">Out of Stock</option>
        </select>

        {/* Sorting Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-lg text-sm text-soft-white/85 focus:outline-none focus:border-zinc-700 transition-all font-sans cursor-pointer min-w-[140px]"
        >
          <option value="recently-added" className="bg-zinc-950 text-soft-white/80">Recently Added</option>
          <option value="price-low" className="bg-zinc-950 text-soft-white/80">Price: Low to High</option>
          <option value="price-high" className="bg-zinc-950 text-soft-white/80">Price: High to Low</option>
          <option value="name-az" className="bg-zinc-950 text-soft-white/80">Name: A to Z</option>
        </select>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Link href="/admin/products/new">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95">
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Product</span>
            </button>
          </Link>

          <button
            onClick={() => toast.info("Bulk Import feature is coming soon!")}
            className="flex items-center justify-center p-2.5 bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition-all"
            title="Bulk Import"
          >
            <Upload size={18} />
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#12131a]/40 rounded-xl border border-zinc-800/40">
          <p className="text-zinc-400 mb-4 font-sans text-sm">
            {products.length === 0 ? "No products uploaded yet." : "No matching products found."}
          </p>
          {products.length === 0 && (
            <Link href="/admin/products/new">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-lg text-sm font-semibold transition-all shadow-md mx-auto">
                <Plus size={16} strokeWidth={2.5} />
                <span>Add Your First Product</span>
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
