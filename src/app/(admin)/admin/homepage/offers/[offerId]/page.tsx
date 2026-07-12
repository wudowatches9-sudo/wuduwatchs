import { getFeaturedOfferById, getAllProducts } from "@/lib/contentful";
import { OfferFormClient } from "./OfferFormClient";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface OfferEditorPageProps {
  params: {
    offerId: string;
  };
}

export default async function OfferEditorPage({ params }: OfferEditorPageProps) {
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

  const { offerId } = params;
  const isNew = offerId === "new";
  const offer = isNew ? null : await getFeaturedOfferById(offerId);
  const products = await getAllProducts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isNew ? "Create New Offer" : "Edit Offer"}
      </h1>
      <OfferFormClient initialOffer={offer} isNew={isNew} products={products} />
    </div>
  );
}