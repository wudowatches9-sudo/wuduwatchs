"use server";

import { revalidatePath } from "next/cache";
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

export async function createOrUpdateOffer(prevState: any, formData: FormData) {
  const offerId = formData.get("offerId") as string | null;

  const data = {
    title: formData.get("title") as string,
    ctaButtonText: formData.get("ctaButtonText") as string,
    ctaLink: formData.get("ctaLink") as string, // This represents the selected product slug
  };

  // Server-side validation
  if (!data.title || !data.ctaButtonText || !data.ctaLink) {
    return { error: "Title, Button Text, and Product Link are required fields." };
  }

  const imageFile = formData.get("image") as File;
  const currentImageUrl = formData.get("currentImageUrl") as string;
  let imageUrl = currentImageUrl;

  try {
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    if (!imageUrl) {
      return { error: "Background Image is required." };
    }

    const payload = {
      title: data.title,
      cta_button_text: data.ctaButtonText,
      product_slug: data.ctaLink,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    if (offerId) {
      const { error } = await supabaseAdmin
        .from("featured_offers")
        .update(payload)
        .eq("id", offerId);
      if (error) throw error;
    } else {
      const newId = randomUUID();
      const { error } = await supabaseAdmin
        .from("featured_offers")
        .insert({
          id: newId,
          ...payload,
          created_at: new Date().toISOString(),
        });
      if (error) throw error;
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/offers");

    return { success: true, message: "Offer saved successfully!" };
  } catch (error: any) {
    console.error("Supabase Save Offer Error:", error);
    return { error: error.message || "Failed to save offer. Please check server logs." };
  }
}

export async function deleteOffer(prevState: any, formData: FormData) {
  const offerId = formData.get("offerId") as string;

  try {
    // Fetch details to delete image from Cloudinary
    const { data: offer, error: fetchError } = await supabaseAdmin
      .from("featured_offers")
      .select("image_url")
      .eq("id", offerId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Delete from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from("featured_offers")
      .delete()
      .eq("id", offerId);

    if (deleteError) throw deleteError;

    // Delete from Cloudinary
    if (offer && offer.image_url) {
      const publicId = extractPublicId(offer.image_url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryErr) {
          console.error(`Failed to delete Cloudinary image ${publicId}:`, cloudinaryErr);
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/offers");

    return { success: true, message: "Offer deleted successfully!" };
  } catch (error: any) {
    console.error("Delete Offer Error:", error);
    return { error: error.message || "Failed to delete offer." };
  }
}