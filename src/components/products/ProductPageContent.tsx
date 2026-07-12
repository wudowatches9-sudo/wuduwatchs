'use client';

import { ProductGallery } from './ProductGallery';
import { ProductDetails } from './ProductDetails';
import { ProductInformation } from './ProductInformation';

interface ProductPageContentProps {
  product: any;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

export function ProductPageContent({ product, selectedImage, setSelectedImage }: ProductPageContentProps) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-40">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <ProductGallery 
              product={product} 
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
          </div>
          <div className="mt-8 lg:mt-0 lg:p-4">
            <ProductDetails 
              product={product} 
              stock={product.stock}
              selectedImage={selectedImage}
            />
          </div>
        </div>
        <div className="mt-12">
          <ProductInformation product={product} />
        </div>
      </div>
    </>
  );
}
