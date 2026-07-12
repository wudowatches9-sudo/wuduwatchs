export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreditCard, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getAllProducts } from "@/lib/contentful";

export default async function AdminPage() {
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

  // Fetch data after authorization checks pass
      const { data: orders, error } = await supabase.from("orders").select("total_amount");

  if (error) {
    console.error("Error fetching orders:", error);
    // Handle the error appropriately
  }

  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  const products = await getAllProducts();
  const totalProducts = products.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`BDT ${totalRevenue.toFixed(2)}`}
          icon={<CreditCard className="w-8 h-8 text-green-500" />}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toString()}
          icon={<Package className="w-8 h-8 text-blue-500" />}
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={<ShoppingCart className="w-8 h-8 text-orange-500" />}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickLink href="/admin/orders" title="Manage Orders" />
        <QuickLink href="/admin/products" title="Manage Products" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function QuickLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      {title}
    </Link>
  );
}
