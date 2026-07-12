import { Suspense } from 'react';
import { getAllSocialPosts } from "@/lib/contentful";
import { SocialPostsClientList } from "./SocialPostsClientList";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SocialPostsListPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Defense in Depth: Verify user is authenticated (SECURE METHOD)
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Defense in Depth: Verify user has admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  const socialPosts = await getAllSocialPosts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialPostsClientList socialPosts={socialPosts} />
    </Suspense>
  );
}
