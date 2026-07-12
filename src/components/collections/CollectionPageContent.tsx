"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/collections/ProductGrid";
import FilterSidebar from "@/components/collections/FilterSidebar";
import { Product } from "@/types/product";

interface CollectionPageContentProps {
  initialProducts: Product[];
}

export function CollectionPageContent({ initialProducts }: CollectionPageContentProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [activeFilters, setActiveFilters] = useState<{
    sizes: string[];
    colors: string[];
  }>({ sizes: [], colors: [] });

  useEffect(() => {
    setProducts(initialProducts);
    setFilteredProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    let result = [...products];

    if (activeFilters.sizes.length > 0) {
      result = result.filter(product =>
        product.sizes.some(size => activeFilters.sizes.includes(size))
      );
    }

    if (activeFilters.colors.length > 0) {
      result = result.filter(product =>
        product.colors.some(color => activeFilters.colors.includes(color))
      );
    }

    setFilteredProducts(result);
  }, [activeFilters, products]);

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => {
      const key = filterType === "size" ? "sizes" : "colors";
      const currentValues = prev[key];
      
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [key]: newValues };
    });
  };

  const getAllSizes = () => {
    const allSizes = products.flatMap(p => p.sizes);
    return [...new Set(allSizes)];
  }

  const getAllColors = () => {
    const allColors = products.flatMap(p => p.colors);
    return [...new Set(allColors)];
  }

  return (
    <div className="flex gap-8">
      <div className="w-1/4 hidden lg:block">
        <FilterSidebar
          filterOptions={{
            size: getAllSizes(),
            color: getAllColors(),
          }}
          onFilterChange={handleFilterChange}
          onClose={() => {}}
        />
      </div>
      <div className="w-full lg:w-3/4">
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
