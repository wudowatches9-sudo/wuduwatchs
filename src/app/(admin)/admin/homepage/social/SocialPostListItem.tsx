"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { deleteSocialPost } from "@/actions/homepageActions";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg shadow-sm border border-muted-gold/10 bg-rich-black mb-4 transition-all hover:bg-white/5 gap-4">
      <h2 className="text-base font-semibold text-soft-white font-heading break-all line-clamp-2 md:line-clamp-1 flex-1 mr-4">
        {post.postLink}
      </h2>
      <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
        <Link href={`/admin/homepage/social/${post.id}`} className="flex-1 md:flex-none">
          <Button
            variant="outline"
            className="w-full md:w-auto text-green-400 border-green-500/50 hover:bg-green-500/10 hover:text-green-300 font-sans h-9"
          >
            Edit
          </Button>
        </Link>

        <DeleteConfirmationDialog onConfirm={() => {
          const form = document.getElementById(`delete-form-${post.id}`) as HTMLFormElement;
          form.requestSubmit();
        }}>
          <form id={`delete-form-${post.id}`} action={deleteAction} className="flex-1 md:flex-none">
            <input type="hidden" name="postId" value={post.id} />
            <Button
              type="button"
              variant="destructive"
              className="w-full md:w-auto bg-red-600/90 text-white hover:bg-red-600 font-sans border border-red-500/50 h-9"
            >
              Delete
            </Button>
          </form>
        </DeleteConfirmationDialog>
      </div>
    </div>
  );
}
