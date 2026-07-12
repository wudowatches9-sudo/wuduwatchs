"use client";

import { useFormState } from "react-dom";
import { createOrUpdateProduct } from "@/actions/productActions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Label } from "@/components/ui/label";
import { AdminTextarea } from "@/components/admin/AdminTextarea";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AdminInput } from "@/components/admin/AdminInput";
import { ColorSwatchManager } from "@/components/admin/ColorSwatchManager";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductFormProps {
  product: any | null;
}

const initialState = {
  error: undefined,
  success: false,
  message: "",
};

const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const [state, formAction] = useFormState(createOrUpdateProduct, initialState);
  const router = useRouter();

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [colorSwatches, setColorSwatches] = useState<Array<{ name: string; hex: string }>>([]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin/products");
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  useEffect(() => {
    if (product && product.fields) {
      // New Cloudinary-based shape: mainImage is a string URL, galleryImages is an array of string URLs
      if (product.fields.mainImage) {
        // mainImage is now a direct string URL
        setMainImagePreview(product.fields.mainImage as string);
      }
      if (
        product.fields.galleryImages &&
        Array.isArray(product.fields.galleryImages)
      ) {
        // galleryImages is now an array of string URLs
        setGalleryPreviews(product.fields.galleryImages as string[]);
      }
      if (product.fields.colorSwatches) {
        setColorSwatches(product.fields.colorSwatches);
      }
    } else {
      setMainImagePreview(null);
      setGalleryPreviews([]);
      setColorSwatches([]);
    }
  }, [product]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setGalleryPreviews(urls);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {product ? "Edit Product" : "Add New Product"}
      </h1>
      <form
        key={product?.sys?.id || "new-product"}
        action={formAction}
        className="space-y-4"
      >
        {product && (
          <input type="hidden" name="productId" value={product.sys.id} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <AdminInput
              id="name"
              name="name"
              placeholder="e.g., Submariner Date Automatic Watch"
              defaultValue={product?.fields.name || ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <AdminInput
              id="price"
              name="price"
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 1200"
              defaultValue={product?.fields.price?.toString() || ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="originalPrice">Original Price</Label>
            <AdminInput
              id="originalPrice"
              name="originalPrice"
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 1500 (for showing discount)"
              defaultValue={product?.fields.originalPrice?.toString() || ""}
            />
          </div>
          <div>
            <Label htmlFor="category">Watch Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={product?.fields.category || ""}
              required
              className="p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading w-full text-sm"
            >
              <option value="" className="bg-black text-white">Select a category</option>
              <option value="automatic" className="bg-black text-white">Automatic</option>
              <option value="quartz" className="bg-black text-white">Quartz</option>
              <option value="chronograph" className="bg-black text-white">Chronograph</option>
              <option value="diver" className="bg-black text-white">Diver</option>
              <option value="luxury" className="bg-black text-white">Luxury</option>
              <option value="classic" className="bg-black text-white">Classic</option>
            </select>
          </div>
          <div>
            <Label htmlFor="subcategory">Subcategory</Label>
            <AdminInput
              id="subcategory"
              name="subcategory"
              placeholder="e.g., Luxury, Professional, Vintage"
              defaultValue={product?.fields.subcategory || ""}
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <AdminInput
              id="stock"
              name="stock"
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 100"
              defaultValue={product?.fields.stock?.toString() || ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="sizes">Case Sizes (comma-separated)</Label>
            <AdminInput
              id="sizes"
              name="sizes"
              placeholder="e.g., 38mm, 40mm, 42mm"
              defaultValue={product?.fields.sizes?.join(", ") || ""}
            />
          </div>

          <div className="md:col-span-2">
            <ColorSwatchManager
              value={colorSwatches}
              onChange={setColorSwatches}
            />
            <input
              type="hidden"
              name="colorSwatches"
              value={JSON.stringify(colorSwatches)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <AdminInput
              id="shortDescription"
              name="shortDescription"
              placeholder="Brief summary (max 256 characters)"
              defaultValue={product?.fields.shortDescription || ""}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="longDescription">Long Description</Label>
            <AdminTextarea
              id="longDescription"
              name="longDescription"
              placeholder="Detailed product description including features, benefits, and unique selling points..."
              defaultValue={product?.fields.longDescription || ""}
              rows={5}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="sizingAndFit">Specifications</Label>
            <AdminTextarea
              id="sizingAndFit"
              name="sizingAndFit"
              placeholder="e.g., Caliber: Automatic mechanical. Diameter: 40mm. Thickness: 12mm. Power reserve: 48 hours."
              defaultValue={product?.fields.sizingAndFit || ""}
              rows={5}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="materialsAndCare">Movement & Materials</Label>
            <AdminTextarea
              id="materialsAndCare"
              name="materialsAndCare"
              placeholder="e.g., Oystersteel case. Sapphire crystal glass. Solid links bracelet."
              defaultValue={product?.fields.materialsAndCare || ""}
              rows={5}
            />
          </div>
          <div>
            <Label htmlFor="mainImage">Main Image</Label>
            <AdminInput
              id="mainImage"
              name="mainImage"
              type="file"
              onChange={handleMainImageChange}
            />
            {mainImagePreview && (
              <div className="mt-2">
                <Image
                  src={mainImagePreview}
                  alt="Main image preview"
                  width={100}
                  height={100}
                />
                <input
                  type="hidden"
                  name="currentMainImageUrl"
                  value={product?.fields.mainImage || ""}
                />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="galleryImages">Gallery Images</Label>
            <AdminInput
              id="galleryImages"
              name="galleryImages"
              type="file"
              multiple
              onChange={handleGalleryImagesChange}
            />
            {galleryPreviews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {galleryPreviews.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    width={100}
                    height={100}
                  />
                ))}
              </div>
            )}
            <div className="flex items-center mt-4">
              <Label htmlFor="isFeatured" className="mr-2">
                Is Featured?
              </Label>
              <AdminInput
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                defaultChecked={product?.fields.isFeatured || false}
              />
            </div>
            <div className="flex items-center mt-4">
              <Label htmlFor="displayOnHomepage" className="mr-2">
                Display on Homepage &quot;Just for You&quot; section?
              </Label>
              <AdminInput
                id="displayOnHomepage"
                name="displayOnHomepage"
                type="checkbox"
                defaultChecked={product?.fields.displayOnHomepage || false}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="rating">Rating</Label>
              <AdminInput
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                placeholder="e.g., 4.5"
                defaultValue={product?.fields.rating?.toString() || ""}
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="reviewCount">Review Count</Label>
              <AdminInput
                id="reviewCount"
                name="reviewCount"
                type="number"
                step="1"
                min="0"
                placeholder="e.g., 100"
                defaultValue={product?.fields.reviewCount?.toString() || ""}
              />
            </div>
          </div>
        </div>

        <SubmitButton className="bg-green-500 text-black hover:bg-green-600">
          Save Product
        </SubmitButton>
      </form>
    </div>
  );
};

export default ProductForm;
