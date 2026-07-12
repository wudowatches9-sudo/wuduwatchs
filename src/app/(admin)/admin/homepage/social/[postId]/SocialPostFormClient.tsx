"use client";

import { useFormState } from "react-dom";
import { createOrUpdateSocialPost } from "@/actions/homepageActions";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { AdminInput } from "@/components/admin/AdminInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SocialPostFormClientProps {
  initialPost: any | null;
  isNew: boolean;
}

const initialState = {
  error: undefined,
  message: "",
  success: false,
};

export function SocialPostFormClient({ initialPost, isNew }: SocialPostFormClientProps) {
  const [state, formAction] = useFormState(createOrUpdateSocialPost, initialState);
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPost?.image || null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin/homepage/social");
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      {initialPost && (
        <input type="hidden" name="postId" value={initialPost.id} />
      )}
      {initialPost && (
        <input
          type="hidden"
          name="currentImageUrl"
          value={initialPost.image}
        />
      )}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="postLink">Post Link (Facebook, Instagram, or TikTok URL)</Label>
        <AdminInput
          id="postLink"
          name="postLink"
          defaultValue={initialPost?.postLink}
          placeholder="https://instagram.com/p/..."
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="image">Post Image</Label>
        <AdminInput
          id="image"
          name="image"
          type="file"
          onChange={handleFileChange}
          required={isNew}
        />
        {previewUrl && (
          <div className="mt-4">
            <Image
              src={previewUrl}
              alt="Image preview"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        )}
      </div>
      <SubmitButton className="bg-green-500 text-black hover:bg-green-600">
        Save Social Post
      </SubmitButton>
    </form>
  );
}
