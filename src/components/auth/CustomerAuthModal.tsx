"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Input } from "@/components/ui/input";
import { User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { useRouter } from "next/navigation";

// Google SVG Icon Component
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
);

interface CustomerAuthModalProps {
  children?: React.ReactNode;
}

export function CustomerAuthModal({ children }: CustomerAuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error on new submission

    const email = formData.email;
    const password = formData.password;
    const fullName = formData.fullName;

    // Log the data you are about to send


    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      // --- THIS IS THE KEY DIAGNOSTIC ---
      if (error) {

        setError(error.message); // Set the error state to display it
        return; // Stop the function here
      }
      // ------------------------------------

      // If successful, you can log the success and maybe close the modal

      toast.success(
        "Account created! Please check your email to verify your account."
      );
      setIsOpen(false);
      setFormData({ email: "", password: "", fullName: "" });
      router.push("/account");
    } catch (err) {
      // This will catch any other unexpected JS errors

      setError("An unexpected error occurred. Please try again.");
    } finally {
      
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
        throw error;
      }

      toast.success("Welcome back!");
      setIsOpen(false);
      // Refresh the page to update the UI
      router.push("/account");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to sign in with Google");
      }
      // Note: User will be redirected to Google, so we don't need to handle success here
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleSubmit =
    mode === "signup"
      ? (e: React.FormEvent<HTMLFormElement>) => handleSignUp(e)
      : (e: React.FormEvent<HTMLFormElement>) => handleSignIn(e);

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setFormData({ email: "", password: "", fullName: "" });
    setError(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <button
            aria-label="Account"
            className="text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
          >
            <User strokeWidth={1.5} size={20} />
          </button>
        )}
      </SheetTrigger>
      <SheetContent position="right" size="sm" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-heading text-foreground dark:text-soft-white">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </SheetTitle>
          <SheetDescription className="dark:text-soft-white">
            {mode === "signin"
              ? "Sign in to access your account"
              : "Sign up to start shopping"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span className="font-sans">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted-gold/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground dark:text-soft-white/60">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-sans dark:text-soft-white mb-2"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                placeholder="John Doe"
                className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-sans dark:text-soft-white mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="you@example.com"
              className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-sans dark:text-soft-white mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full p-3 pr-12 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-gold/60 hover:text-muted-gold transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 dark:text-soft-white">{error}</p>}

          <AuthSubmitButton
            className="w-full dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading py-4 rounded-lg transition-transform hover:scale-105 disabled:opacity-50"
            loading={loading}
            loadingText={mode === "signin" ? "Signing In..." : "Signing Up..."}
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </AuthSubmitButton>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm dark:text-soft-white hover:text-muted-gold"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
