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

export async function createOrUpdateSocialPost(prevState: any, formData: FormData) {
  const postId = formData.get("postId") as string | null;
  const postLink = formData.get("postLink") as string;

  // Server-side validation
  if (!postLink) {
    return { error: "Post Link is a required field." };
  }

  const imageFile = formData.get("image") as File;
  const currentImageUrl = formData.get("currentImageUrl") as string;
  let imageUrl = currentImageUrl;

  try {
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    if (!imageUrl) {
      return { error: "Image is required. Please upload an image." };
    }

    const payload = {
      image_url: imageUrl,
      post_link: postLink,
      updated_at: new Date().toISOString(),
    };

    if (postId) {
      const { error } = await supabaseAdmin
        .from("social_posts")
        .update(payload)
        .eq("id", postId);
      if (error) throw error;
    } else {
      const newId = randomUUID();
      const { error } = await supabaseAdmin
        .from("social_posts")
        .insert({
          id: newId,
          ...payload,
          created_at: new Date().toISOString(),
        });
      if (error) throw error;
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/social");

    return { success: true, message: "Social post saved successfully!" };
  } catch (error: any) {
    console.error("Supabase Save Social Post Error:", error);
    return { error: error.message || "Failed to save social post. Please check server logs." };
  }
}

export async function deleteSocialPost(prevState: any, formData: FormData) {
  const postId = formData.get("postId") as string;

  try {
    // Get details before deleting to clean up Cloudinary
    const { data: post, error: fetchError } = await supabaseAdmin
      .from("social_posts")
      .select("image_url")
      .eq("id", postId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Delete from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from("social_posts")
      .delete()
      .eq("id", postId);

    if (deleteError) throw deleteError;

    // Delete from Cloudinary
    if (post && post.image_url) {
      const publicId = extractPublicId(post.image_url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryErr) {
          console.error(`Failed to delete Cloudinary image ${publicId}:`, cloudinaryErr);
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/social");

    return { success: true, message: "Social post deleted successfully!" };
  } catch (error: any) {
    console.error("Delete Social Post Error:", error);
    return { error: error.message || "Failed to delete social post." };
  }
}
