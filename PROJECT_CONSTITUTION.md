# -----------------------------------------------------------
#            PROJECT CONSTITUTION: "Classy Mart"
# -----------------------------------------------------------
# This document is the absolute source of truth for all
# architectural decisions, core principles, and established
# patterns for the Classy Mart e-commerce platform.
#
# ALL NEW FEATURES AND REFACTORS MUST ADHERE TO THESE RULES.
# ANY AI WORKING ON THIS PROJECT MUST READ AND UNDERSTAND
# THIS DOCUMENT BEFORE WRITING ANY CODE.
# -----------------------------------------------------------

## 1. The Core Doctrines (Our Philosophy)

- **"Better Than Amazon":** We compete on a curated, premium boutique experience, not logistics. Every design and UX choice must feel luxurious and intentional.
- **"Supersonic" Performance:** Perceived performance is the most critical feature. We prioritize fast load times, instant transitions, and optimized assets. All pages must strive for a perfect Lighthouse score.
- **"Fluid Motion":** All major user interactions must be enhanced with subtle, performant animations using `Framer Motion` to provide a responsive and premium feel.
- **"Aura Lookbook" Design System:** The primary theme is a premium dark mode. All design choices must adhere to the established color palette and typography.
  - **Primary Action Color:** Emerald Green (`#009B77`) is used for all primary CTAs (Add to Cart, Place Order, etc.).
  - **Accent/Secondary Color:** Muted Gold (`#B4A284`) is used for secondary text, links, and highlights.
  - **Fonts:** `Satoshi` for headings, `Inter` for body/UI text.

## 2. The Technology Stack (Non-Negotiable)

- **Frontend Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with a variable-based Shadcn/UI theme.
- **State Management:** Zustand. `useCartStore` for the global cart, `useProductPageStore` for PDP state.
- **Backend Services:**
  - **CMS (Products & Homepage Content):** Contentful
  - **Database (Orders & User Profiles):** Supabase
  - **Media (Images):** Cloudinary
  - **Authentication:** Supabase Auth (with a dual-path system)
- **Deployment:** Netlify

## 3. The "Golden Rule" of Production Caching (CRITICAL)

**Problem Solved:** The live production site on Netlify MUST always display real-time data without requiring a new build. Stale data is the #1 critical bug.

**The Definitive Solution (A Multi-Layered Strategy):** All new features must respect and utilize this established architecture.

- **Rule A (For Server Components):** Any server-rendered page that displays dynamic data from Contentful or Supabase (e.g., Homepage, Collection Pages) **MUST** include `export const dynamic = 'force-dynamic';` at the top of the `page.tsx` file.

- **Rule B (For Server Actions):** Any Server Action that mutates data (`create`, `update`, `delete`) **MUST** include a comprehensive list of `revalidatePath()` calls for all potentially affected routes *after* the successful mutation and *before* the final `redirect`.

- **Rule C (For Critical Client Pages):** Highly interactive pages that require guaranteed real-time data (e.g., the entire Admin Panel) **MUST** use a full Client-Side Rendering (CSR) architecture.
  - The page must be a `"use client"` component.
  - It must fetch its data using a `useEffect` hook.
  - The `fetch` call **MUST** be made to an internal, secure API route (e.g., `/api/admin/orders`).
  - The `fetch` call **MUST** use the `{ cache: 'no-store' }` option and is recommended to use a cache-busting timestamp parameter (`?_t=${Date.now()}`).

- **Rule D (For API Routes):** All internal API routes that serve dynamic data **MUST** include `export const dynamic = 'force-dynamic';` and are recommended to return explicit `Cache-Control: no-store` headers.

## 4. Architectural Patterns & Established Logic

- **Image Handling:** All user-uploaded images are handled via a server action. The image is uploaded to **Cloudinary**, and the resulting secure **string URL** is saved to a **"Short text"** field in Contentful/Supabase. The database does **not** store image files.

- **Authentication:** A dual-path system is in place.
  - **Customers:** Use a modal-based (`Sheet`) UI for Sign In/Up with Email/Password and Google. Managed via client-side Supabase JS.
  - **Admins:** Use a dedicated page (`/admin/login`). Access to all `/admin/*` routes is protected by a **`middleware.ts`** file that performs a real-time database check for the user's `role`.

- **Form Submissions (Admin Panel):** All admin forms are CSR components that call Server Actions. All submit buttons are the reusable `<SubmitButton />` component which uses `useFormStatus` to show a pending state.

- **Text Formatting:** Long-text fields from Contentful that require line breaks to be preserved **MUST** be rendered in an element with the `whitespace-pre-line` Tailwind CSS class.

- **Error Handling:** All server actions and API routes must be wrapped in `try...catch` blocks to prevent server crashes and provide graceful error feedback.

## 5. Restrictions & Future Development

- **Free Tier Constraint:** The application is designed to run within the free tiers of Netlify, Contentful, Supabase, and Cloudinary. Any new feature proposal must consider this constraint. Solutions that require frequent builds (e.g., webhooks triggering deployments) are **prohibited**.

- **Phase 2 Features (On Hold):**
  - Automated deletion of Cloudinary images when a product is deleted.
  - A more advanced "On-Demand ISR" strategy if the current dynamic rendering proves to be a performance bottleneck (unlikely).

## 6. Production Launch & Handover Configuration

### Production Domain
- **Final Production Domain:** `classymart2024.com`
- All hardcoded URLs in the codebase have been updated to use this domain:
  - `src/app/sitemap.ts` - Sitemap base URL
  - `src/app/robots.ts` - Robots.txt sitemap reference
  - `src/app/layout.tsx` - Metadata base URL and OpenGraph URLs

### Security Settings (Supabase)
- **Row Level Security (RLS):** Enabled on all tables
- **Email Confirmation:** Enabled for user authentication
- **Admin Access:** Protected via middleware.ts with role-based access control

### Environment Variables (Netlify)
The following environment variables must be configured in Netlify:
- `NEXT_PUBLIC_BASE_URL` - Set to `https://classymart2024.com`
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `CONTENTFUL_SPACE_ID` - Contentful space ID
- `CONTENTFUL_DELIVERY_API_ACCESS_TOKEN` - Contentful delivery API token
- `CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN` - Contentful management API token
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Payment Methods
- **Cash on Delivery (COD):** Fully enabled and functional
- **bKash:** Visually present but disabled with "Coming Soon" tooltip
- **Nagad:** Visually present but disabled with "Coming Soon" tooltip

### Final Codebase State
- ✅ All dynamic pages include `export const dynamic = 'force-dynamic'`
- ✅ All API routes include `export const dynamic = 'force-dynamic'` and Cache-Control headers
- ✅ All server actions include comprehensive `try...catch` error handling
- ✅ All admin CSR pages use `{ cache: 'no-store' }` in fetch calls
- ✅ All URLs updated to production domain
- ✅ Payment method selector refactored with disabled states and tooltips

### Pre-Launch Checklist
- [ ] Verify all environment variables are set in Netlify
- [ ] Test admin login and role-based access
- [ ] Verify email confirmation flow in Supabase
- [ ] Test order placement and stock reduction
- [ ] Verify RLS policies are active in Supabase
- [ ] Test payment method selector (COD should work, bKash/Nagad should show "Coming Soon")
- [ ] Verify sitemap.xml is accessible at `/sitemap.xml`
- [ ] Verify robots.txt is accessible at `/robots.txt`
- [ ] Test all admin CRUD operations (products, offers, social posts, lookbook)
- [ ] Verify all revalidatePath calls are working correctly

# -----------------------------------------------------------
#           END OF PROJECT CONSTITUTION
# -----------------------------------------------------------