import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
}

/**
 * SectionWrapper Component - Professional Layout Container
 * 
 * Provides consistent, contained layout for informational sections.
 * Ensures proper spacing and maximum width constraints for desktop layouts.
 * 
 * Classes: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24
 * Design: Street-Luxe system with psychology-driven spacing
 */
export function SectionWrapper({ children }: SectionWrapperProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {children}
    </section>
  );
}

