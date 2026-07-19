"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/productActions";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Bind the deleteProduct action with null as prevState
  const boundDeleteProduct = deleteProduct.bind(null, null);

  const handleConfirmDelete = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  // Safe retrieval of main image
  const mainImage = product.images?.main || "/logo.png";
  
  return (
    <div className="bg-[#12131a] rounded-xl overflow-hidden border border-zinc-800/40 hover:border-muted-gold/20 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] w-full bg-[#1b1c24] overflow-hidden flex items-center justify-center">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Information Section */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="font-heading font-semibold text-soft-white text-base md:text-lg line-clamp-1 mb-1" title={product.name}>
            {product.name}
          </h3>
          <div className="flex justify-between items-baseline mt-2">
            <p className="text-xl font-heading font-bold text-soft-white">
              ৳&nbsp;{product.price.toLocaleString()}
            </p>
            <p className={`text-xs font-sans font-medium ${product.stock > 0 ? 'text-zinc-400' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/40">
          <Link href={`/admin/products/${product.slug}`} className="flex-grow">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800/60 hover:bg-zinc-800 text-soft-white hover:text-white rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition-all font-sans text-sm font-medium"
            >
              <Pencil size={15} className="text-muted-gold" />
              <span>Edit Product</span>
            </button>
          </Link>

          <form ref={formRef} action={boundDeleteProduct} className="hidden">
            <input type="hidden" name="productId" value={product.id} />
          </form>

          <DeleteConfirmationDialog onConfirm={handleConfirmDelete}>
            <button
              type="button"
              className="p-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded-lg border border-red-900/30 hover:border-red-900/50 transition-all flex items-center justify-center"
              title="Delete Product"
            >
              <Trash2 size={16} />
            </button>
          </DeleteConfirmationDialog>
        </div>
      </div>
    </div>
  );
}
