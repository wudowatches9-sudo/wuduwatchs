"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ParallaxProviderWrapper } from "@/components/providers/ParallaxProviderWrapper";
import { Header } from "@/components/layout/Header";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { Footer } from "@/components/layout/Footer";
import { CartController } from "@/components/cart/CartController";
import { ImmersiveSearch } from "@/components/layout/ImmersiveSearch";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/products");
  const isCheckoutPage = pathname.startsWith("/checkout");
  const isAdminPage = pathname.startsWith("/admin");

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <ParallaxProviderWrapper>
        <CartController />
        <ImmersiveSearch />
        {(!((isProductPage || isCheckoutPage) && !isDesktop) && !isAdminPage) && <Header />}
        {children}
        <Footer />
        {!isProductPage && !isCheckoutPage && !isAdminPage && !isDesktop && <BottomNavBar />}
      </ParallaxProviderWrapper>
    </ThemeProvider>
  );
}