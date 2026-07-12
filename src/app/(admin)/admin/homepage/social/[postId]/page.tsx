import { getSocialPostById } from "@/lib/contentful";
import { SocialPostFormClient } from "./SocialPostFormClient";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SocialPostEditorPageProps {
  params: {
    postId: string;
  };
}

export default async function SocialPostEditorPage({ params }: SocialPostEditorPageProps) {
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

  const { postId } = params;
  const isNew = postId === "new";
  const post = isNew ? null : await getSocialPostById(postId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isNew ? "Create New Social Post" : "Edit Social Post"}
      </h1>
      <SocialPostFormClient initialPost={post} isNew={isNew} />
    </div>
  );
}
