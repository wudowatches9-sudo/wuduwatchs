import { ProductCard } from "@/components/products/ProductCard";

interface JustForYouSectionProps {
  products: any[];
}

export function JustForYouSection({ products }: JustForYouSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6">
      <div className="container mx-auto px-4 text-left md:text-center">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-6">
            Just for You
          </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
