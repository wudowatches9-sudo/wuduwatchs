"use client";

import { useFormState } from "react-dom";
import { updateLookbook } from "@/actions/lookbookActions";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { AdminInput } from "@/components/admin/AdminInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LookbookFormClientProps {
  initialLookbook: any | null;
}

const initialState = {
  error: undefined,
  message: "",
  success: false,
};

export function LookbookFormClient({ initialLookbook }: LookbookFormClientProps) {
  const [state, formAction] = useFormState(updateLookbook, initialState);
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialLookbook?.fields.backgroundImage || null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin/homepage/lookbook");
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
      {initialLookbook && (
        <input
          type="hidden"
          name="lookbookEntryId"
          value={initialLookbook.sys.id}
        />
      )}
      {initialLookbook && (
        <input
          type="hidden"
          name="currentImageUrl"
          value={initialLookbook.fields.backgroundImage}
        />
      )}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="title">Title</Label>
        <AdminInput
          id="title"
          name="title"
          defaultValue={initialLookbook?.fields.title}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <AdminInput
          id="subtitle"
          name="subtitle"
          defaultValue={initialLookbook?.fields.subtitle}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="ctaButtonText">Button Text</Label>
        <AdminInput
          id="ctaButtonText"
          name="ctaButtonText"
          defaultValue={initialLookbook?.fields.ctaButtonText}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="ctaLink">Button Link</Label>
        <AdminInput
          id="ctaLink"
          name="ctaLink"
          defaultValue={initialLookbook?.fields.ctaLink}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="backgroundImage">Background Image</Label>
        <AdminInput
          id="backgroundImage"
          name="backgroundImage"
          type="file"
          onChange={handleFileChange}
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
        Save Lookbook
      </SubmitButton>
    </form>
  );
}
