"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function signInAdmin(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        error: "Email and password are required",
      };
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        error: authError.message,
      };
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      // Sign out the user if they're not an admin
      await supabase.auth.signOut();
      return {
        error: "Access denied. Admin privileges required.",
      };
    }

    // Success - redirect to admin dashboard
    redirect("/admin");
  } catch (error: any) {
    console.error("Error in signInAdmin:", error);
    return {
      error: error.message || "An unexpected error occurred. Please try again.",
    };
  }
}

export async function signOutUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // First, tell Supabase to sign the user out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      // Still proceed to clear cookies
    }

    // Manually find and remove all Supabase auth cookies
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')) {
        cookieStore.delete(cookie.name);
      }
    });

  } catch (err) {
    console.error('Unexpected error during sign out:', err);
  }
  
  // Finally, redirect to the homepage to complete the process
  return redirect('/');
}

export async function login(prevState: any, formData: FormData) {
  // Alias for backward compatibility
  return signInAdmin(prevState, formData);
}
