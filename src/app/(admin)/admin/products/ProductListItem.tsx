"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/productActions";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { useRef } from "react";

interface ProductListItemProps {
  product: any;
}

export function ProductListItem({ product }: ProductListItemProps) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // Bind the deleteProduct action with null as prevState
  const boundDeleteProduct = deleteProduct.bind(null, null);

  const handleConfirmDelete = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {product.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        ৳&nbsp;{product.price.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {product.stock}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex gap-2 justify-end">
          <Link href={`/admin/products/${product.slug}`}>
            <Button
              variant="outline"
              className="text-green-500 border-green-500 hover:bg-green-50 dark:text-green-400 dark:border-green-400"
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
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </Button>
          </DeleteConfirmationDialog>
        </div>
      </td>
    </tr>
  );
}
