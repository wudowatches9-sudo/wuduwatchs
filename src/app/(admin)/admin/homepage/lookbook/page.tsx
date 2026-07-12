import { getLookbookData } from "@/lib/contentful";
import { LookbookFormClient } from "./LookbookFormClient";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function LookbookPage() {
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

  const lookbookData = await getLookbookData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Lookbook</h1>
      {lookbookData ? (
        <LookbookFormClient initialLookbook={lookbookData} />
      ) : (
        <p>No Lookbook entry found. Please create one in Contentful.</p>
      )}
    </div>
  );
}
