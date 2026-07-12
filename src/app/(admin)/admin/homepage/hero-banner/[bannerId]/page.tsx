import { getHeroBannerById, getAllProducts } from "@/lib/contentful";
import { HeroBannerFormClient } from "../HeroBannerFormClient";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface EditHeroBannerPageProps {
  params: {
    bannerId: string;
  };
}

export default async function EditHeroBannerPage({ params }: EditHeroBannerPageProps) {
  const { bannerId } = params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  // Fetch banner data if we are editing an existing banner
  const banner = bannerId === "new" ? null : await getHeroBannerById(bannerId);
  const products = await getAllProducts();

  // If trying to edit a non-existent banner, redirect to list
  if (bannerId !== "new" && !banner) {
    redirect('/admin/homepage/hero-banner?error=Banner not found');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        {bannerId === "new" ? "Create New Hero Banner" : "Edit Hero Banner"}
      </h1>
      <HeroBannerFormClient initialBanner={banner} products={products} bannerId={bannerId} />
    </div>
  );
}
