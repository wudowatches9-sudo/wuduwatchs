/**
 * Product Layout - Route Group
 * 
 * Excludes main site Header and BottomNavBar from product pages
 * Provides clean slate for dedicated product experience
 */

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
