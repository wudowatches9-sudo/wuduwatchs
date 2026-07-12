import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

interface HomepageProductGridProps {
  products: Product[];
}

export function HomepageProductGrid({ products }: HomepageProductGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold font-heading text-left md:text-center mb-8">Just For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
