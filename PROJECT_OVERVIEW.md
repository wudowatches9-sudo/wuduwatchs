# Classy Mart - Complete Project Overview

> **Purpose:** This document provides a comprehensive overview of the Classy Mart e-commerce platform to facilitate future design improvements and feature development.

---

## 1. Executive Summary

**Classy Mart** is a premium men's fashion e-commerce platform built for the Bangladesh market. The project emphasizes a "Better Than Amazon" boutique experience with a luxurious, premium feel. The platform targets men's clothing categories including T-shirts, Shirts, Pants, Panjabis, Jackets, Hoodies, and Accessories.

| Attribute | Details |
|-----------|---------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS + Shadcn/UI components |
| **State Management** | Zustand |
| **CMS** | Contentful |
| **Database** | Supabase |
| **Media Storage** | Cloudinary |
| **Authentication** | Supabase Auth |
| **Deployment** | Netlify |
| **Production URL** | https://classymart2024.com |

---

## 2. Design System: "Aura Lookbook"

### 2.1 Color Palette

```
┌─────────────────────────────────────────────────────────────────┐
│  LIGHT MODE                      │  DARK MODE                   │
├─────────────────────────────────────────────────────────────────┤
│  Background: Gallery White       │  Background: Rich Black      │
│  #FAF8F5                         │  #111111                     │
│                                  │                              │
│  Foreground: Charcoal Black      │  Foreground: Soft White      │
│  #1A1A1A                         │  #F0EBE3                     │
│                                  │                              │
│  Primary: Emerald Green          │  Primary: Emerald Green      │
│  #009B77                         │  #009B77                     │
│                                  │                              │
│  Muted: Gray                     │  Muted: Muted Gold           │
│  #737373                         │  #B4A284                     │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Typography

| Role | Font | Usage |
|------|------|-------|
| **Headings** | Satoshi (local) | H1-H6, product names, section titles |
| **Body/UI** | Inter (Google) | Paragraphs, buttons, form labels |

### 2.3 Key Design Tokens (from `globals.css`)

```css
/* Light Mode */
--primary: 0 100% 50%;           /* Brand Red (used for CTAs) */
--background: 40 33% 97%;        /* Gallery White */
--foreground: 0 0% 10%;          /* Charcoal Black */
--border: 0 0% 88%;              /* Stone Gray */

/* Dark Mode */
--primary: 165 100% 30%;         /* Emerald Green #009B77 */
--background: 0 0% 7%;           /* Rich Black #111111 */
--foreground: 39 23% 92%;        /* Soft White #F0EBE3 */
--muted-foreground: 34 23% 61%;  /* Muted Gold #B4A284 */
```

---

## 3. Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (admin)/admin/           # Admin panel (protected)
│   │   ├── homepage/            # Manage offers, lookbook, social
│   │   ├── products/            # Product CRUD
│   │   └── orders/              # Order management
│   ├── (product)/               # Product-related pages
│   ├── account/                 # User account pages
│   ├── api/                     # API routes
│   ├── auth/                    # Auth callback handlers
│   ├── checkout/                # Checkout flow
│   ├── collections/[handle]/    # Category/collection pages
│   ├── contact/                 # Contact page
│   ├── payment/                 # Payment confirmation pages
│   ├── story/                   # About/story page
│   ├── privacy-policy/          # Legal page
│   ├── terms-of-service/        # Legal page
│   ├── layout.tsx               # Root layout with SEO
│   ├── page.tsx                 # Homepage
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Robots.txt
│
├── components/                   # Reusable UI components
│   ├── homepage/                # Homepage sections (10 files)
│   ├── products/                # Product components (10 files)
│   ├── layout/                  # Header, Footer, Nav (7 files)
│   ├── cart/                    # Cart drawer (2 files)
│   ├── checkout/                # Checkout components (3 files)
│   ├── collections/             # Collection page components (5 files)
│   ├── auth/                    # Auth modals (2 files)
│   ├── admin/                   # Admin panel components (8 files)
│   ├── ui/                      # Shadcn/UI primitives (14 files)
│   ├── skeletons/               # Loading skeletons (5 files)
│   └── providers/               # Context providers (2 files)
│
├── actions/                      # Server Actions
│   ├── adminActions.ts          # Admin utilities
│   ├── authActions.ts           # Authentication
│   ├── orderActions.ts          # Order placement & management
│   ├── productActions.ts        # Product CRUD
│   ├── offerActions.ts          # Offer management
│   ├── lookbookActions.ts       # Lookbook management
│   └── homepageActions.ts       # Homepage content
│
├── stores/                       # Zustand state stores
│   ├── cart-store.ts            # Shopping cart state
│   ├── cart-drawer-store.ts     # Drawer open/close state
│   ├── product-page-store.ts    # PDP size/color selection
│   └── search-store.ts          # Search modal state
│
├── lib/                          # Utilities & clients
│   ├── contentful.ts            # Contentful CMS client
│   ├── supabase.ts              # Supabase client
│   ├── supabase/                # Supabase SSR helpers
│   ├── cloudinary.ts            # Cloudinary config
│   └── utils.ts                 # Utility functions (cn, etc.)
│
├── types/                        # TypeScript type definitions
│   └── product.ts               # Product type interface
│
├── middleware.ts                 # Auth middleware for admin routes
└── fonts/                        # Local font files (Satoshi)
```

---

## 4. Key Components Inventory

### 4.1 Homepage Components (`src/components/homepage/`)

| Component | Description | Data Source |
|-----------|-------------|-------------|
| `HeroSection.tsx` | Mobile: carousel of offers; Desktop: hero video | Contentful offers |
| `FeaturedOffers.tsx` | Promotional offer cards | Contentful |
| `FeaturedCategories.tsx` | Category navigation grid | Static |
| `TrendingProducts.tsx` | Featured product grid | Contentful |
| `JustForYouSection.tsx` | Personalized product section | Contentful |
| `LookbookSection.tsx` | Lifestyle/lookbook gallery | Contentful |
| `SocialProofSection.tsx` | Instagram-style social posts | Contentful |
| `HeroSlider.tsx` | Alternative slider component | - |
| `HomepageSkeleton.tsx` | Loading state skeleton | - |

### 4.2 Product Components (`src/components/products/`)

| Component | Description |
|-----------|-------------|
| `ProductCard.tsx` | Product grid card with hover effects |
| `ProductDetails.tsx` | Size/color selectors, stock indicator, Add to Cart |
| `ProductGallery.tsx` | Image gallery with main + thumbnails |
| `ProductInformation.tsx` | Product description/specs |
| `ProductPageLayout.tsx` | PDP layout container |
| `ProductPageHeader.tsx` | Breadcrumbs, back button |
| `StickyActionFooter.tsx` | Mobile sticky Add to Cart bar |

### 4.3 Layout Components (`src/components/layout/`)

| Component | Description |
|-----------|-------------|
| `Header.tsx` | Main header with logo, nav, cart, auth |
| `Footer.tsx` | 4-column footer with social links |
| `BottomNavBar.tsx` | Mobile bottom navigation |
| `MobileNav.tsx` | Mobile hamburger menu drawer |
| `ImmersiveSearch.tsx` | Full-screen search modal |
| `RootLayoutClient.tsx` | Client-side providers wrapper |

### 4.4 UI Primitives (`src/components/ui/`)

All based on Shadcn/UI:
- `button.tsx`, `input.tsx`, `label.tsx`, `textarea.tsx`
- `Sheet.tsx`, `BottomSheet.tsx` (drawers)
- `dropdown-menu.tsx`, `alert-dialog.tsx`, `tooltip.tsx`
- `AnimatedButton.tsx` (custom with Framer Motion)
- `SubmitButton.tsx` (with useFormStatus)
- `ThemeToggle.tsx` (dark/light mode)
- `badge.tsx`, `skeleton.tsx`

---

## 5. Pages & Routes

### 5.1 Customer-Facing Pages

| Route | Page | Type |
|-------|------|------|
| `/` | Homepage | Server (dynamic) |
| `/products/[slug]` | Product Detail Page | Server (dynamic) |
| `/collections/[handle]` | Collection/Category Page | Server (dynamic) |
| `/checkout` | Checkout | Client |
| `/payment/success` | Order confirmation | Client |
| `/payment/failed` | Payment failure | Client |
| `/account` | User account | Client |
| `/account/orders` | Order history | Client |
| `/story` | About page | Static |
| `/contact` | Contact form | Static |
| `/privacy-policy` | Privacy policy | Static |
| `/terms-of-service` | Terms of service | Static |

### 5.2 Admin Panel Pages (`/admin/*`) - Protected

| Route | Function |
|-------|----------|
| `/admin` | Dashboard overview |
| `/admin/products` | Product list & management |
| `/admin/products/[slug]` | Edit product |
| `/admin/products/[slug]/delete` | Delete confirmation |
| `/admin/orders` | Order management |
| `/admin/homepage/offers` | Manage promotional offers |
| `/admin/homepage/lookbook` | Manage lookbook images |
| `/admin/homepage/social` | Manage social proof posts |

---

## 6. State Management (Zustand Stores)

### 6.1 `cart-store.ts` - Shopping Cart

```typescript
interface CartStore {
  cartItems: CartItem[];
  addToCart: (item) => void;
  removeFromCart: (id, size?, color?) => void;
  updateQuantity: (id, quantity, size?, color?) => void;
  clearCart: () => void;
}
```
- Persisted to localStorage
- Unique items by `id + size + color` combination

### 6.2 `cart-drawer-store.ts` - Drawer State

```typescript
{ isOpen: boolean; open: () => void; close: () => void }
```

### 6.3 `product-page-store.ts` - PDP State

```typescript
{ 
  selectedSize: string | null;
  selectedColor: { name: string; hex: string } | null;
  setSelectedSize: () => void;
  setSelectedColor: () => void;
}
```

### 6.4 `search-store.ts` - Search Modal

```typescript
{ isOpen: boolean; open: () => void; close: () => void }
```

---

## 7. Server Actions Architecture

All located in `src/actions/`:

| Action File | Key Functions |
|-------------|---------------|
| `orderActions.ts` | `placeOrder()`, `updateOrderStatus()`, stock reduction |
| `productActions.ts` | `createProduct()`, `updateProduct()`, `deleteProduct()` |
| `offerActions.ts` | `createOffer()`, `updateOffer()`, `deleteOffer()` |
| `lookbookActions.ts` | Lookbook CRUD operations |
| `authActions.ts` | `signUp()`, `signIn()`, `signOut()` |

**Key Pattern:** All actions include:
- `try...catch` error handling
- `revalidatePath()` calls after mutations
- Image upload to Cloudinary, URL stored in CMS

---

## 8. Authentication Architecture

### Dual-Path System:

1. **Customers:**
   - Modal-based (Sheet component)
   - Email/Password + Google OAuth
   - Client-side Supabase Auth

2. **Admins:**
   - Dedicated `/admin/login` page
   - Role-based access control
   - Protected by `middleware.ts`

### Middleware Protection (`middleware.ts`):
- Intercepts all `/admin/*` routes
- Checks `profiles` table for `role === 'admin'`
- Redirects unauthorized users to `/admin/login`

---

## 9. External Integrations

### 9.1 Contentful (CMS)

**Content Types:**
- Products (name, slug, price, images, sizes, colors, stock)
- Featured Offers (title, image, CTA link)
- Lookbook (images, titles)
- Social Posts (images, captions)

**Client:** `src/lib/contentful.ts`

### 9.2 Supabase (Database)

**Tables:**
- `profiles` (user info, role)
- `orders` (order details, status, shipping info)

**Auth:** Email/Password, Google OAuth

### 9.3 Cloudinary (Media)

- Product images upload
- Lookbook images
- Offer banners

**Config:** `src/lib/cloudinary.ts`

---

## 10. Key Design Patterns

### 10.1 Mobile-First Responsive Design

```jsx
// Pattern: Hide on mobile, show on desktop
<div className="hidden lg:block">
  {/* Desktop content */}
</div>

// Pattern: Show on mobile, hide on desktop
<div className="lg:hidden">
  {/* Mobile content */}
</div>
```

### 10.2 Dynamic Caching Strategy

```typescript
// For server pages with dynamic data
export const dynamic = 'force-dynamic';

// For API routes
export const dynamic = 'force-dynamic';
// + Cache-Control: no-store header
```

### 10.3 Skeleton Loading Pattern

```jsx
<Suspense fallback={<HomepageSkeleton />}>
  <HomeContent />
</Suspense>
```

### 10.4 Animation Pattern (Framer Motion)

Used in: `AnimatedButton.tsx`, cart drawer transitions, page transitions

---

## 11. Current Features Checklist

### E-commerce Core
- [x] Product listing (grid view)
- [x] Product detail pages with size/color selection
- [x] Shopping cart with drawer
- [x] Checkout with shipping form
- [x] Order placement (COD enabled)
- [x] Order confirmation page
- [x] Stock management

### User Experience
- [x] Dark/Light mode toggle
- [x] Mobile-responsive design
- [x] Immersive search modal
- [x] Mobile bottom navigation
- [x] Hover effects on cards (desktop)
- [x] Image hover on product cards
- [x] Skeleton loading states

### Admin Panel
- [x] Protected admin routes
- [x] Product CRUD operations
- [x] Order management
- [x] Homepage content management (offers, lookbook, social)
- [x] Image upload to Cloudinary

### Authentication
- [x] Customer sign up/sign in
- [x] Google OAuth
- [x] Admin login
- [x] Role-based access control

### SEO
- [x] Dynamic metadata per page
- [x] OpenGraph tags
- [x] Twitter cards
- [x] Sitemap generation
- [x] Robots.txt
- [x] Structured data (JSON-LD)

### Payments
- [x] Cash on Delivery (COD)
- [ ] bKash (Coming Soon - UI present)
- [ ] Nagad (Coming Soon - UI present)

---

## 12. Component Design Observations

### 12.1 Strengths
- Consistent use of Tailwind CSS design tokens
- Mobile-first responsive approach
- Proper skeleton loading states
- Clean separation of concerns (components, actions, stores)

### 12.2 Areas for Potential Improvement

| Area | Current State | Potential Enhancement |
|------|--------------|----------------------|
| **ProductCard** | Good hover effects | Consider image zoom on mobile tap |
| **HeroSection** | Mobile carousel / Desktop video | Desktop could have more interactive CTAs |
| **Footer** | 4-column grid | Could be more compact on mobile |
| **Color Swatches** | Basic circles | Could add border on light colors |
| **Cart Drawer** | Slide-in drawer | Could add better empty state UI |
| **Search** | Full-screen modal | Could add recent searches, suggestions |
| **Loading States** | Basic skeletons | Could add shimmer animations |

---

## 13. Dependencies Summary

### Core
- `next@^14.2.33` - Framework
- `react@^18` - UI library
- `tailwindcss@^3.4.1` - Styling
- `framer-motion@^12.23.24` - Animations
- `zustand@^5.0.8` - State management

### UI Components
- `@radix-ui/*` - Primitives (dialog, dropdown, tooltip, etc.)
- `lucide-react@^0.544.0` - Icons
- `class-variance-authority` - Variant utilities
- `tailwind-merge` - Class merging

### Backend/Services
- `@supabase/ssr@^0.7.0` - Supabase SSR client
- `contentful@^11.8.6` - CMS client
- `contentful-management@^11.60.4` - CMS admin client
- `cloudinary@^2.7.0` - Media upload

### UI Features
- `embla-carousel-react@^8.6.0` - Carousels
- `yet-another-react-lightbox@^3.25.0` - Image lightbox
- `sonner@^2.0.7` - Toast notifications
- `@fortawesome/*` - Social icons

---

## 14. Quick Reference: Key Files

| Purpose | File Path |
|---------|-----------|
| Design System | `src/app/globals.css`, `tailwind.config.ts` |
| Root Layout | `src/app/layout.tsx` |
| Homepage | `src/app/page.tsx` |
| Product Page | `src/app/(product)/products/[slug]/page.tsx` |
| Cart Store | `src/stores/cart-store.ts` |
| Contentful Client | `src/lib/contentful.ts` |
| Supabase Client | `src/lib/supabase.ts` |
| Auth Middleware | `src/middleware.ts` |
| Order Actions | `src/actions/orderActions.ts` |
| Project Constitution | `PROJECT_CONSTITUTION.md` |

---

*This document was generated on January 1, 2026 to support the design improvement handover process.*
