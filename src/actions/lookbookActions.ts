"use server";

import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabase";

// Helper function to upload an image to Cloudinary
async function uploadImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      })
      .end(buffer);
  });
  return uploadResult.secure_url;
}

export async function updateLookbook(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const ctaButtonText = formData.get("ctaButtonText") as string;
  const ctaLink = formData.get("ctaLink") as string;
  const image = formData.get("backgroundImage") as File;
  const currentImageUrl = formData.get("currentImageUrl") as string | null;

  try {
    let imageUrl = currentImageUrl;
    if (image && image.size > 0) {
      imageUrl = await uploadImage(image);
    }

    const payload = {
      id: "lookbook_entry",
      title: title || "",
      subtitle: subtitle || "",
      cta_link: ctaLink || "",
      cta_button_text: ctaButtonText || "",
      background_image: imageUrl || "",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from("lookbook")
      .upsert(payload);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/homepage/lookbook");

    return { success: true, message: "Lookbook updated successfully!" };
  } catch (error: any) {
    console.error("Supabase Save Lookbook Error:", error);
    return { error: error.message || "Failed to update lookbook. Please check server logs." };
  }
}
