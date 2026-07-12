import { ProductCard } from "@/components/products/ProductCard";

interface TrendingProductsProps {
  products: any[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  return (
    <section className="py-4 sm:py-6">
      <div className="container mx-auto px-4 text-left md:text-center">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Trending Now
          </h2>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}