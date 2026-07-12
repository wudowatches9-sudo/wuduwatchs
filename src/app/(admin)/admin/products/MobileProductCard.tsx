"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/productActions";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { useRef } from "react";

interface MobileProductCardProps {
  product: any;
}

export function MobileProductCard({ product }: MobileProductCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Bind the deleteProduct action with null as prevState
  const boundDeleteProduct = deleteProduct.bind(null, null);

  const handleConfirmDelete = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="bg-rich-black p-4 rounded-lg shadow-sm border border-muted-gold/10 mb-4 transition-all hover:bg-white/5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-soft-white text-base line-clamp-1 font-heading">
            {product.name}
          </h3>
          <p className="text-xs text-muted-gold/80 mt-1 uppercase tracking-wider font-medium font-sans">
            {product.category || 'Uncategorized'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-soft-white text-lg font-heading">৳&nbsp;{product.price.toFixed(2)}</p>
          <p className={`text-xs mt-1 font-medium font-sans ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-muted-gold/10 flex justify-end gap-3">
        <Link href={`/admin/products/${product.slug}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-green-400 border-green-500/50 hover:bg-green-500/10 hover:text-green-300 font-sans"
          >
            Edit
          </Button>
        </Link>

        <form ref={formRef} action={boundDeleteProduct}>
          <input type="hidden" name="productId" value={product.id} />
        </form>

        <DeleteConfirmationDialog onConfirm={handleConfirmDelete}>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="flex-1 bg-red-600/90 text-white hover:bg-red-600 font-sans border border-red-500/50"
          >
            Delete
          </Button>
        </DeleteConfirmationDialog>
      </div>
    </div>
  );
}
