import { Suspense } from 'react';
import { getAllFeaturedOffers } from "@/lib/contentful";
import { OffersClientList } from "./OffersClientList";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function OffersListPage() {
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

  const offers = await getAllFeaturedOffers();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OffersClientList offers={offers} />
    </Suspense>
  );
}
