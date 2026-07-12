-- ============================================================================
-- SUPABASE MIGRATION DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor.
-- ============================================================================

-- 0. Required Authentication Tables & Functions
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role TEXT DEFAULT 'customer' NOT NULL CHECK (role IN ('customer', 'admin')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile for new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  main_image TEXT NOT NULL,
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  subcategory TEXT,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  short_description TEXT,
  long_description TEXT,
  sizing_and_fit TEXT,
  materials_and_care TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_on_homepage BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  color_swatches JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Select policy: Allow anyone (anon and authenticated) to read products
CREATE POLICY "Allow public read access to products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Write policy: Allow authenticated admin users to insert, update, and delete products
CREATE POLICY "Allow admin write access to products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 2. Lookbook Table
CREATE TABLE IF NOT EXISTS public.lookbook (
  id TEXT PRIMARY KEY DEFAULT 'lookbook_entry',
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_link TEXT,
  cta_button_text TEXT,
  background_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.lookbook ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to lookbook"
  ON public.lookbook
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin write access to lookbook"
  ON public.lookbook
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 3. Social Posts Table
CREATE TABLE IF NOT EXISTS public.social_posts (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  post_link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to social_posts"
  ON public.social_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin write access to social_posts"
  ON public.social_posts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 4. Featured Offers Table
CREATE TABLE IF NOT EXISTS public.featured_offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  cta_button_text TEXT NOT NULL DEFAULT 'Shop Now',
  product_slug TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.featured_offers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to featured_offers"
  ON public.featured_offers
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin write access to featured_offers"
  ON public.featured_offers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 5. Hero Banner Table (Desktop)
CREATE TABLE IF NOT EXISTS public.hero_banner (
  id TEXT PRIMARY KEY DEFAULT 'desktop_banner',
  product_slug TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cta_button_text TEXT NOT NULL DEFAULT 'Shop Now',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.hero_banner ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to hero_banner"
  ON public.hero_banner
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin write access to hero_banner"
  ON public.hero_banner
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 6. Orders Table & Sequences
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1000;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_email TEXT,
  ordered_products JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number INTEGER DEFAULT nextval('public.order_number_seq'::regclass) UNIQUE,
  PRIMARY KEY (id)
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Allow customers to view their own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow public insert (checkout)"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin full access to orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
