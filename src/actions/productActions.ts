"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

// Interface for upload result with publicId for rollback capability
interface UploadResult {
  url: string;
  publicId: string;
}

// Helper function to upload an image to Cloudinary and return both URL and publicId
async function uploadImageWithId(file: File): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({}, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    }).end(buffer);
  });
  return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
}

// Extract publicId from Cloudinary URL
function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

// Delete images from Cloudinary by publicIds
async function deleteCloudinaryImages(publicIds: string[]): Promise<void> {
  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary image ${publicId}:`, error);
    }
  }
}

export async function createOrUpdateProduct(prevState: any, formData: FormData) {
  const productId = formData.get("productId") as string | null;
  const name = formData.get("name") as string;

  // Server-side validation
  if (!name) {
    return { error: "Product name is required." };
  }

  const priceRaw = formData.get('price') as string;
  if (!priceRaw || isNaN(Number(priceRaw)) || Number(priceRaw) <= 0) {
    return { error: "Price is required and must be a valid positive number." };
  }

  const sizesRaw = formData.get("sizes") as string || "";
  const sizes = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);
  if (sizes.length === 0) {
    return { error: "At least one case size is required." };
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '-');
  const data = {
    price: parseInt(priceRaw, 10),
    originalPrice: parseInt(formData.get('originalPrice') as string || '0', 10),
    stock: parseInt(formData.get('stock') as string || '0', 10),
    rating: parseFloat(formData.get("rating") as string || '0'),
    reviewCount: parseInt(formData.get("reviewCount") as string || '0', 10),
  };

  const category = (formData.get("category") as string) || "watches";
  const subcategory = formData.get("subcategory") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const longDescription = formData.get("longDescription") as string;
  const sizingAndFit = formData.get("sizingAndFit") as string;
  const materialsAndCare = formData.get("materialsAndCare") as string;
  const isFeatured = formData.get("isFeatured") === "on"; // Checkbox value
  const displayOnHomepage = formData.get("displayOnHomepage") === "on"; // Checkbox value
  
  // Parse colors & color swatches JSON
  const colors = (formData.get("colors") as string || "").split(',').map(c => c.trim()).filter(Boolean);
  const colorSwatchesJSON = formData.get("colorSwatches") as string;
  const colorSwatches = colorSwatchesJSON ? JSON.parse(colorSwatchesJSON) : [];

  const mainImageFile = formData.get("mainImage") as File;
  const currentMainImageUrl = formData.get("currentMainImageUrl") as string | null;
  const galleryImageFiles = formData.getAll("galleryImages") as File[];
  const currentGalleryImageUrls = JSON.parse(formData.get("currentGalleryImageUrls") as string || "[]");

  // Track newly uploaded images for rollback on error
  const newlyUploadedPublicIds: string[] = [];

  try {
    let mainImageUrl: string | null = currentMainImageUrl;
    if (mainImageFile && mainImageFile.size > 0) {
      const result = await uploadImageWithId(mainImageFile);
      mainImageUrl = result.url;
      newlyUploadedPublicIds.push(result.publicId);
    }

    if (!mainImageUrl) {
      return { error: "Main image is required." };
    }

    let galleryImageUrls: string[] = [...currentGalleryImageUrls];
    for (const file of galleryImageFiles) {
      if (file && file.size > 0) {
        const result = await uploadImageWithId(file);
        galleryImageUrls.push(result.url);
        newlyUploadedPublicIds.push(result.publicId);
      }
    }

    const payload = {
      name,
      slug,
      price: data.price,
      original_price: data.originalPrice || null,
      category,
      subcategory: subcategory || null,
      stock: data.stock,
      sizes,
      colors,
      short_description: shortDescription || null,
      long_description: longDescription || null,
      sizing_and_fit: sizingAndFit || null,
      materials_and_care: materialsAndCare || null,
      is_featured: isFeatured,
      display_on_homepage: displayOnHomepage,
      rating: data.rating,
      review_count: data.reviewCount,
      main_image: mainImageUrl,
      gallery_images: galleryImageUrls,
      color_swatches: colorSwatches,
      updated_at: new Date().toISOString(),
    };

    if (productId) {
      const { error } = await supabaseAdmin
        .from("products")
        .update(payload)
        .eq("id", productId);

      if (error) throw error;
    } else {
      const newId = randomUUID();
      const { error } = await supabaseAdmin
        .from("products")
        .insert({
          id: newId,
          ...payload,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    }

    // Comprehensive revalidation for all affected pages
    revalidatePath("/"); // Homepage
    revalidatePath("/products"); // All products page
    revalidatePath(`/products/${slug}`); // Individual product page
    revalidatePath("/collections/all"); // All products collection
    revalidatePath(`/collections/${category}`); // Specific category page
    revalidatePath("/admin/products"); // Admin products page

    return { success: true, message: "Product saved successfully!" };
  } catch (error: any) {
    console.error("Supabase Save Product Error:", error);
    
    // ROLLBACK: Delete newly uploaded images from Cloudinary
    if (newlyUploadedPublicIds.length > 0) {
      console.log("Rolling back Cloudinary uploads:", newlyUploadedPublicIds);
      await deleteCloudinaryImages(newlyUploadedPublicIds);
    }
    
    return { error: error.message || "Failed to save product. Please check server logs." };
  }
}

export async function deleteProduct(prevState: any, formData: FormData) {
  const productId = formData.get("productId") as string;

  try {
    // Get product details before deletion to know which paths to revalidate
    const { data: product, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!product) throw new Error("Product not found");

    const productSlug = product.slug;
    const productCategory = product.category;
    const mainImageUrl = product.main_image;
    const galleryImageUrls = product.gallery_images || [];

    // Delete from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) throw deleteError;
    
    // Delete images from Cloudinary
    const publicIdsToDelete: string[] = [];
    if (mainImageUrl) {
      const id = extractPublicId(mainImageUrl);
      if (id) publicIdsToDelete.push(id);
    }
    for (const url of galleryImageUrls) {
      const id = extractPublicId(url);
      if (id) publicIdsToDelete.push(id);
    }
    if (publicIdsToDelete.length > 0) {
      console.log("Deleting Cloudinary images:", publicIdsToDelete);
      await deleteCloudinaryImages(publicIdsToDelete);
    }

    // Comprehensive revalidation for all affected pages
    revalidatePath("/"); // Homepage
    revalidatePath("/products"); // All products page
    if (productSlug) {
      revalidatePath(`/products/${productSlug}`); // Individual product page
    }
    revalidatePath("/collections/all"); // All products collection
    if (productCategory) {
      revalidatePath(`/collections/${productCategory}`); // Specific category page
    }
    revalidatePath("/admin/products"); // Admin products page
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    redirect(
      "/admin/products?error=" +
        encodeURIComponent(error.message || "Failed to delete product.")
    );
  }

  redirect(
    "/admin/products?success=" +
      encodeURIComponent("Product deleted successfully!")
  );
}
