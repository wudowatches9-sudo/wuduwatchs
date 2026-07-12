"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;

  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ order_status: status })
      .eq("id", orderId);

    if (error) {
      throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error };
  }
}
