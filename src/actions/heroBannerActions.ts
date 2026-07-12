"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

// Helper function to upload an image to Cloudinary
async function uploadImage(file: File): Promise<string> {
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
  return uploadResult.secure_url;
}

// Extract publicId from Cloudinary URL
function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

export async function createOrUpdateHeroBanner(prevState: any, formData: FormData) {
  const bannerId = formData.get("bannerId") as string | null;
  const productSlug = formData.get("productSlug") as string;
  const ctaButtonText = formData.get("ctaButtonText") as string;
  const imageFile = formData.get("image") as File;
  const currentImageUrl = formData.get("currentImageUrl") as string | null;

  // Server-side validation
  if (!productSlug || !ctaButtonText) {
    return { error: "Product Slug and Button Text are required fields." };
  }

  try {
    let imageUrl = currentImageUrl;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    if (!imageUrl) {
      return { error: "Banner Image is required. Please upload an image." };
    }

    const payload = {
      product_slug: productSlug,
      image_url: imageUrl,
      cta_button_text: ctaButtonText || "Shop Now",
      updated_at: new Date().toISOString(),
    };

    if (bannerId && bannerId !== "new") {
      const { error } = await supabaseAdmin
        .from("hero_banner")
        .update(payload)
        .eq("id", bannerId);
      if (error) throw error;
    } else {
      const newId = randomUUID();
      const { error } = await supabaseAdmin
        .from("hero_banner")
        .insert({
          id: newId,
          ...payload,
          created_at: new Date().toISOString(),
        });
      if (error) throw error;
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/hero-banner");

    return { success: true, message: "Hero Banner saved successfully!" };
  } catch (error: any) {
    console.error("Supabase Save Hero Banner Error:", error);
    return { error: error.message || "Failed to save hero banner. Please check server logs." };
  }
}

export async function deleteHeroBanner(prevState: any, formData: FormData) {
  const bannerId = formData.get("bannerId") as string;

  try {
    // Fetch details to delete image from Cloudinary
    const { data: banner, error: fetchError } = await supabaseAdmin
      .from("hero_banner")
      .select("image_url")
      .eq("id", bannerId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Delete from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from("hero_banner")
      .delete()
      .eq("id", bannerId);

    if (deleteError) throw deleteError;

    // Delete from Cloudinary
    if (banner && banner.image_url) {
      const publicId = extractPublicId(banner.image_url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryErr) {
          console.error(`Failed to delete Cloudinary image ${publicId}:`, cloudinaryErr);
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/hero-banner");

    return { success: true, message: "Hero Banner deleted successfully!" };
  } catch (error: any) {
    console.error("Delete Hero Banner Error:", error);
    return { error: error.message || "Failed to delete hero banner." };
  }
}
