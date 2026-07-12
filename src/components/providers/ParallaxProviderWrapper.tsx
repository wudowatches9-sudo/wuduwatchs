"use client";

import { ParallaxProvider } from "react-scroll-parallax";
import { ReactNode } from "react";

interface ParallaxProviderWrapperProps {
  children: ReactNode;
}

/**
 * ParallaxProviderWrapper Component - Client Boundary
 * 
 * Establishes a client boundary for parallax context.
 * Enables proper server/client component separation following Next.js patterns.
 * 
 * Purpose: Wrap child components that need access to ParallaxProvider context
 * without breaking server component architecture.
 */
export function ParallaxProviderWrapper({ children }: ParallaxProviderWrapperProps) {
  return <ParallaxProvider>{children}</ParallaxProvider>;
}
