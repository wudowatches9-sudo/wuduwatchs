"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCartDrawerStore } from "@/stores/cart-drawer-store";
import { CustomerAuthModal } from "@/components/auth/CustomerAuthModal"; // Import CustomerAuthModal
import { createClient } from "@/lib/supabase/client";

/**
 * Bottom Navigation Bar Component - Mobile-First "Flow UI"
 * 
 * Provides persistent, thumb-friendly navigation on mobile devices.
 * Creates a native app-like experience with sticky bottom positioning.
 * 
 * Visibility: Mobile/Tablet only (hidden on desktop via lg:hidden)
 * Design: Street-Luxe system with psychology-driven UX
 */
export function BottomNavBar() {
  const { cartItems } = useCartStore();
  const { open } = useCartDrawerStore();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background px-2 py-3 pb-6 lg:hidden"
      aria-label="Mobile navigation"
    >
      {/* Home */}
      <Link
        href="/"
        className="flex flex-col items-center gap-1 text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground active:text-foreground dark:active:text-foreground"
      >
        <Home strokeWidth={1.5} size={24} />
        <span className="text-xs font-medium">Home</span>
      </Link>

      {/* Collections */}
      <Link
        href="/collections/all"
        className="flex flex-col items-center gap-1 text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground active:text-foreground dark:active:text-foreground"
      >
        <LayoutGrid strokeWidth={1.5} size={24} />
        <span className="text-xs font-medium">Collections</span>
      </Link>

      {/* Cart with Badge */}
      <button
        onClick={open}
        className="relative flex flex-col items-center gap-1 text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground active:text-foreground dark:active:text-foreground"
      >
        <div className="relative">
          <ShoppingCart strokeWidth={1.5} size={24} />
          {totalItems > 0 && (
                            <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary dark:bg-primary text-[10px] font-bold text-primary-foreground dark:text-rich-black">              {totalItems}
            </div>
          )}
        </div>
        <span className="text-xs font-medium">Cart</span>
      </button>

      {/* Account */}
      {user ? (
        <Link
          href={profile?.role === 'admin' ? '/admin' : '/account'}
          aria-label={profile?.role === 'admin' ? 'Admin Dashboard' : 'Account'}
          className="flex flex-col items-center gap-1 text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground active:text-foreground dark:active:text-foreground"
        >
          <User strokeWidth={1.5} size={24} />
          <span className="text-xs font-medium">{profile?.role === 'admin' ? 'Admin' : 'Account'}</span>
        </Link>
      ) : (
        <CustomerAuthModal>
          <button
            aria-label="Account"
            className="flex flex-col items-center gap-1 text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground active:text-foreground dark:active:text-foreground"
          >
            <User strokeWidth={1.5} size={24} />
            <span className="text-xs font-medium">Account</span>
          </button>
        </CustomerAuthModal>
      )}
    </nav>
  );
}