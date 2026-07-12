-- ============================================
-- Migration: Add Sequential Order Number
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create a sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1 INCREMENT BY 1;

-- Step 2: Add the order_number column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_number INTEGER UNIQUE;

-- Step 3: Backfill existing orders with sequential numbers (oldest first)
WITH numbered_orders AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.orders
)
UPDATE public.orders
SET order_number = numbered_orders.rn
FROM numbered_orders
WHERE public.orders.id = numbered_orders.id;

-- Step 4: Set the sequence to continue from the last order number
SELECT setval('order_number_seq', COALESCE((SELECT MAX(order_number) FROM public.orders), 0));

-- Step 5: Set default value for new orders (auto-increment)
ALTER TABLE public.orders 
ALTER COLUMN order_number SET DEFAULT nextval('order_number_seq');

-- Step 6: Make order_number NOT NULL (after backfilling)
ALTER TABLE public.orders 
ALTER COLUMN order_number SET NOT NULL;

-- Verify: Check the first few orders
SELECT order_number, id, customer_name, created_at 
FROM public.orders 
ORDER BY order_number ASC 
LIMIT 10;
