"use client";

import Link from "next/link";
import Image from "next/image";
import { useFormState } from "react-dom";
import { deleteSocialPost } from "@/actions/homepageActions";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

interface SocialPostListItemProps {
  post: any;
}

const initialState = {
  error: undefined,
  message: "",
  success: false,
};

export function SocialPostListItem({ post }: SocialPostListItemProps) {
  const [deleteState, deleteAction] = useFormState(deleteSocialPost, initialState);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (deleteState?.success) {
      toast.success(deleteState.message);
      router.refresh();
    }
    if (deleteState?.error) {
      toast.error(deleteState.error);
    }
  }, [deleteState, router]);

  const handleConfirmDelete = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const imageUrl = post.image || "/logo.png";

  return (
    <div className="bg-[#12131a] rounded-xl overflow-hidden border border-zinc-800/40 hover:border-muted-gold/20 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Background Image Preview */}
      <div className="relative aspect-square w-full bg-[#1b1c24] overflow-hidden flex items-center justify-center">
        <Image
          src={imageUrl}
          alt="Social media post image"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Information Section */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="font-heading font-semibold text-soft-white text-xs break-all line-clamp-2" title={post.postLink}>
            {post.postLink}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/40">
          <Link href={`/admin/homepage/social/${post.id}`} className="flex-grow">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800/60 hover:bg-zinc-800 text-soft-white hover:text-white rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition-all font-sans text-sm font-medium"
            >
              <Pencil size={15} className="text-muted-gold" />
              <span>Edit Post</span>
            </button>
          </Link>

          <form ref={formRef} action={deleteAction} className="hidden">
            <input type="hidden" name="postId" value={post.id} />
          </form>

          <DeleteConfirmationDialog onConfirm={handleConfirmDelete}>
            <button
              type="button"
              className="p-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded-lg border border-red-900/30 hover:border-red-900/50 transition-all flex items-center justify-center"
              title="Delete Post"
            >
              <Trash2 size={16} />
            </button>
          </DeleteConfirmationDialog>
        </div>
      </div>
    </div>
  );
}
