"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { SocialPostListItem } from "./SocialPostListItem";

interface SocialPostsClientListProps {
  socialPosts: any[];
}

export function SocialPostsClientList({ socialPosts }: SocialPostsClientListProps) {
  const searchParams = useSearchParams();

  // Show toast notifications from URL params
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(success);
      window.history.replaceState({}, "", "/admin/homepage/social");
    }
    if (error) {
      toast.error(error);
      window.history.replaceState({}, "", "/admin/homepage/social");
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Social Media Posts</h1>
        <Link href="/admin/homepage/social/new">
          <Button className="bg-green-500 text-black hover:bg-green-600">
            Create New Post
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {socialPosts.map((post) => (
          <SocialPostListItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
