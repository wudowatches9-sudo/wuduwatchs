"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { deleteHeroBanner } from "@/actions/heroBannerActions";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HeroBannerListItemProps {
  banner: any;
}

const initialState = {
  error: undefined,
  message: "",
  success: false,
};

export function HeroBannerListItem({ banner }: HeroBannerListItemProps) {
  const [deleteState, deleteAction] = useFormState(deleteHeroBanner, initialState);
  const router = useRouter();

  useEffect(() => {
    if (deleteState?.success) {
      toast.success(deleteState.message);
      router.refresh();
    }
    if (deleteState?.error) {
      toast.error(deleteState.error);
    }
  }, [deleteState, router]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded bg-white shadow-sm dark:bg-zinc-800 dark:border-zinc-700 gap-4">
      <div className="flex items-center gap-4">
        {banner.image && (
          <div className="relative w-36 h-20 rounded overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
            <Image
              src={banner.image}
              alt="Banner image"
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Linked Product: <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-primary">{banner.ctaLink}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Button: "{banner.ctaButtonText}"</p>
        </div>
      </div>

      <div className="flex gap-2 w-full md:w-auto justify-end">
        <Link href={`/admin/homepage/hero-banner/${banner.id}`}>
          <Button
            variant="outline"
            className="text-green-500 border-green-500 hover:bg-green-50 dark:text-green-400 dark:border-green-400"
          >
            Edit
          </Button>
        </Link>

        <DeleteConfirmationDialog onConfirm={() => {
          const form = document.getElementById(`delete-banner-form-${banner.id}`) as HTMLFormElement;
          form.requestSubmit();
        }}>
          <form id={`delete-banner-form-${banner.id}`} action={deleteAction}>
            <input type="hidden" name="bannerId" value={banner.id} />
            <Button
              type="button"
              variant="destructive"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </Button>
          </form>
        </DeleteConfirmationDialog>
      </div>
    </div>
  );
}
