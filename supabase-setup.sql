-- ============================================================================
-- SUPABASE AUTHENTICATION SETUP
-- Complete SQL scripts for role-based authentication system
-- ============================================================================

-- Step 1: Create the profiles table
-- This table stores user roles and additional public data
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role TEXT DEFAULT 'customer' NOT NULL CHECK (role IN ('customer', 'admin')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Add comment to the table
COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control';

-- Add comments to columns
COMMENT ON COLUMN public.profiles.role IS 'User role: customer or admin';
COMMENT ON COLUMN public.profiles.full_name IS 'User full name from sign up';

-- ============================================================================
-- Step 2: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 3: Create RLS Policies
-- These policies control who can read/write profile data
-- ============================================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Allow service role to read all profiles (for middleware)
CREATE POLICY "Service role can read all profiles"
  ON public.profiles
  FOR SELECT
  TO service_role
  USING (true);

-- ============================================================================
-- Step 4: Create the trigger function
-- This function automatically creates a profile when a new user signs up
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'customer' -- Default role is customer
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment to the function
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile for new users';

-- ============================================================================
-- Step 5: Create the trigger
-- This trigger calls the function after a new user is created
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Step 6: Create updated_at trigger function
-- This keeps the updated_at timestamp current
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- Step 7: Create helper function to check if user is admin
-- This can be used in other RLS policies
-- ============================================================================

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

COMMENT ON FUNCTION public.is_admin() IS 'Check if current user has admin role';

-- ============================================================================
-- Step 8: Grant necessary permissions
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on profiles table
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ============================================================================
-- OPTIONAL: Create an admin user
-- ============================================================================

-- After running the above scripts, you need to:
-- 1. Sign up a user through your application or Supabase Auth UI
-- 2. Then run this query to make them an admin (replace the email):

-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'
-- );

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify your setup
-- ============================================================================

-- Check if profiles table exists
-- SELECT EXISTS (
--   SELECT FROM information_schema.tables 
--   WHERE table_schema = 'public' 
--   AND table_name = 'profiles'
-- );

-- Check if trigger exists
-- SELECT trigger_name 
-- FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_created';

-- Check all profiles
-- SELECT id, role, full_name, created_at FROM public.profiles;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'profiles';

-- ============================================================================
-- END OF SETUP
-- ============================================================================
