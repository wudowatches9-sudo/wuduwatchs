"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server"; // Corrected import
import { cookies } from "next/headers";
import * as contentfulManagement from 'contentful-management';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images?: {
    main: string;
  };
}

interface CartDetails {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
}

export async function placeOrder(
  cartDetails: CartDetails,
  formData: FormData
) {
  let orderId = null;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();


  try {
    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const customerName = `${firstName} ${lastName}`.trim();
    const customerPhone = formData.get("phone") as string;
    const streetAddress = formData.get("address") as string;
    const upazila = formData.get("upazila") as string;
    const district = formData.get("district") as string;

    const customerAddress = `${streetAddress}, ${upazila}, ${district}`.trim();
    const customerCity = district;
    const customerEmail = (formData.get("email") as string) || null;
    const paymentMethod = formData.get("paymentMethod") as string;

    // Construct the order payload according to Supabase schema
    const orderPayload = {
      user_id: user ? user.id : null, // This is the key line
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      customer_city: customerCity,
      customer_email: customerEmail,
      ordered_products: cartDetails.items,
      subtotal: cartDetails.subtotal,
      shipping_cost: cartDetails.shippingCost,
      total_amount: cartDetails.totalAmount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
    };

    // Insert order into Supabase
    console.log('🔵 Inserting order to Supabase...');
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    if (error) {
      console.error('🔴 Supabase insert failed:', error);
      throw error;
    }
    
    if (!data) {
      console.error('🔴 No data returned from insert');
      throw new Error('Failed to create order - no data returned');
    }
    
    orderId = data.id;
    console.log('✅ Order inserted successfully. ID:', orderId);

    // --- AUTOMATED STOCK REDUCTION LOGIC ---
    // Reduce stock in Contentful for each ordered item
    try {
      const client = contentfulManagement.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN!,
      });
      const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
      const environment = await space.getEnvironment('master');

      // Process each item in the cart
      for (const item of cartDetails.items) {
        if (!item.id) {
          console.warn(`Skipping item without ID: ${item.name}`);
          continue;
        }

        try {
          // Get the product entry from Contentful
          const entry = await environment.getEntry(item.id);
          
          // Get current stock (default to 0 if not set)
          const currentStock = entry.fields.stock?.['en-US'] || 0;
          
          // Calculate new stock (reduce by ordered quantity)
          const newStock = currentStock - item.quantity;
          
          // Update stock (ensure it doesn't go below 0)
          entry.fields.stock = { 'en-US': Math.max(0, newStock) };
          
          // Save and publish the updated entry
          const updatedEntry = await entry.update();
          await updatedEntry.publish();
          
          console.log(`✅ Stock updated for ${item.name}: ${currentStock} → ${Math.max(0, newStock)} (reduced by ${item.quantity})`);
        } catch (itemError) {
          console.error(`Failed to update stock for item ${item.id} (${item.name}):`, itemError);
          // Continue processing other items even if one fails
        }
      }
    } catch (contentfulError) {
      // CRITICAL: Log error but don't fail the order
      // The customer has already placed the order successfully
      console.error('⚠️ CRITICAL: Order was placed successfully, but failed to update stock in Contentful.');
      console.error('Order ID:', orderId);
      console.error('Error:', contentfulError);
      console.error('ACTION REQUIRED: Manually adjust stock levels in Contentful for this order.');
      // Note: We don't throw here because the order is already saved
    }
    // --- END OF STOCK REDUCTION LOGIC ---

    // Revalidate admin orders page and products
    revalidatePath("/admin/orders");
    revalidatePath("/products");
    revalidatePath("/");

  } catch (error: any) {
    // This will now only catch REAL errors (database connection, etc.)
    console.error('Error in placeOrder:', error);
    return redirect(`/payment/fail?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect to success page
  redirect(`/payment/success?order_id=${orderId}`);
}

export async function getOrderDetails(orderId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      throw error;
    }

    return {
      cart: data.ordered_products,
      total: data.total_amount,
      order_number: data.order_number,
    };
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    console.log(`🔵 Updating order ${orderId.substring(0, 8)}... status to: ${status}`);
    
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ order_status: status })
      .eq("id", orderId);

    if (error) {
      console.error('🔴 Failed to update order status:', error);
      throw error;
    }

    console.log(`✅ Order status updated successfully to: ${status}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("🔴 Failed to update order status:", error);
    return { success: false, error };
  }
}

export async function getUserOrders() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Use secure getUser() method instead of getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  console.log('🔵 getUserOrders: Fetching orders for user:', user.id);
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("🔴 getUserOrders: Error fetching user orders:", error);
    return [];
  }

  console.log(`✅ getUserOrders: Found ${orders?.length || 0} orders`);
  return orders;
}

export async function getUserOrderById(orderId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Security check: user must be logged in
  if (!user) {

    return null;
  }



  // Critical security measure: filter by BOTH order ID AND user ID
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id) // Ensures user can only access their own orders
    .single();

  if (error) {
    console.error("getUserOrderById: Error fetching order:", error);
    return null;
  }


  return order;
}
