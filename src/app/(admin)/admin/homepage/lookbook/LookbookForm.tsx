'use client';

import { useFormState } from "react-dom";
import { updateLookbook } from "@/actions/lookbookActions";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { AdminInput } from "@/components/admin/AdminInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LookbookFormProps {
  initialData: any | null;
}

const initialState = {
  error: undefined,
  message: "",
  success: false,
};

export function LookbookForm({ initialData }: LookbookFormProps) {
  const [state, formAction] = useFormState(updateLookbook, initialState);
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.fields.backgroundImage || null
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
      {initialData && <input type="hidden" name="entryId" value={initialData.sys.id} />}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <AdminInput id="title" name="title" defaultValue={initialData?.fields.title || ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <AdminInput id="subtitle" name="subtitle" defaultValue={initialData?.fields.subtitle || ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ctaButtonText">Button Text</Label>
        <AdminInput id="ctaButtonText" name="ctaButtonText" defaultValue={initialData?.fields.ctaButtonText || ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ctaLink">Button Link</Label>
        <AdminInput id="ctaLink" name="ctaLink" defaultValue={initialData?.fields.ctaLink || ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="backgroundImage">Background Image</Label>
        <AdminInput id="backgroundImage" name="backgroundImage" type="file" onChange={handleFileChange} />
        {previewUrl && (
          <div className="mt-2">
            <Image
              src={previewUrl}
              alt="Image preview"
              width={200}
              height={200}
              className="rounded-lg"
            />
            <input type="hidden" name="existingImageUrl" value={previewUrl} />
          </div>
        )}
      </div>
      <SubmitButton className="bg-green-500 text-black hover:bg-green-600">Save Changes</SubmitButton>
    </form>
  );
}
