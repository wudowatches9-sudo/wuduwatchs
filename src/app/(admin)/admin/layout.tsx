"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Menu, X } from "lucide-react";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="font-sans antialiased flex min-h-screen bg-rich-black text-soft-white">
      <Toaster richColors position="top-right" />

      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-rich-black border-b border-muted-gold/20 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="text-soft-white hover:text-primary transition-colors"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-bold text-lg font-heading text-soft-white">Admin Panel</span>
        </div>
        <Link href="/" aria-label="Go to Home">
           <Home size={20} className="text-soft-white/70 hover:text-soft-white" />
        </Link>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 h-screen w-52 bg-rich-black text-soft-white shadow-xl 
          border-r border-muted-gold/10 z-50 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-muted-gold/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 font-heading text-primary">
                Wudo
              </h2>
              <p className="text-xs text-muted-gold mt-1 uppercase tracking-widest">Admin Control</p>
            </div>
            <Link 
              href="/" 
              className="p-2 rounded-lg hover:bg-white/5 text-muted-gold hover:text-primary transition-colors"
              title="Visit Store"
            >
              <Home size={20} />
            </Link>
          </div>
        </div>
        
        <nav className="mt-6 px-3 h-[calc(100vh-100px)] overflow-y-auto">
          <Link href="/admin" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors mb-6 group">
            <Home strokeWidth={1.5} size={20} className="text-muted-gold group-hover:text-primary transition-colors" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <h3 className="px-4 py-2 text-[10px] uppercase text-muted-gold/70 font-bold tracking-widest mt-6 mb-2">Store Management</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/admin/orders" onClick={closeSidebar}>
                <p className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm transition-colors text-soft-white/90 hover:text-white">Orders</p>
              </Link>
            </li>
            <li>
              <Link href="/admin/products" onClick={closeSidebar}>
                <p className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm transition-colors text-soft-white/90 hover:text-white">Products</p>
              </Link>
            </li>
          </ul>

          <h3 className="px-4 py-2 text-[10px] uppercase text-muted-gold/70 font-bold tracking-widest mt-8 mb-2">Homepage Management</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/admin/homepage/hero-banner" onClick={closeSidebar}>
                <p className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm transition-colors text-soft-white/90 hover:text-white">Hero Banner</p>
              </Link>
            </li>
            <li>
              <Link href="/admin/homepage/lookbook" onClick={closeSidebar}>
                <p className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm transition-colors text-soft-white/90 hover:text-white">Lookbook</p>
              </Link>
            </li>
            <li>
              <Link href="/admin/homepage/offers" onClick={closeSidebar}>
                <p className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm transition-colors text-soft-white/90 hover:text-white">Featured Offers</p>
              </Link>
            </li>
            <li>
              <Link href="/admin/homepage/social" onClick={closeSidebar}>
                <p className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm transition-colors text-soft-white/90 hover:text-white">Social Proof</p>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-background pt-14 md:pt-0">
        <div className="px-4 pb-4 pt-0 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}