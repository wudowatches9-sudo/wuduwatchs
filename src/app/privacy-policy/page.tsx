export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 font-sans">
      <h1 className="text-3xl font-heading mb-6 text-soft-white">Privacy Policy</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>Last Updated: October 26, 2025</p>
        <h2 className="text-xl font-semibold pt-4 text-soft-white">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when you create an account,
          place an order, or communicate with us. This information includes your name,
          email address, shipping address, and phone number.
        </p>
        <h2 className="text-xl font-semibold pt-4 text-soft-white">2. How We Use Your Information</h2>
        <p>
          The information we collect is used solely for the purpose of processing and
          fulfilling your orders, communicating with you about your order status, and
          providing customer support.
        </p>
        <h2 className="text-xl font-semibold pt-4 text-soft-white">3. Data Storage and Security</h2>
        <p>
          Your order information is securely stored by our backend provider, Supabase.
          We do not store your password; authentication is handled securely via Supabase Auth.
          We do not share your personal information with any third parties for marketing purposes.
        </p>
        <h2 className="text-xl font-semibold pt-4 text-soft-white">4. Your Rights</h2>
        <p>
          You have the right to access and update your account information at any time.
          If you wish to delete your account, please contact us at wudowatches@gmail.com.
        </p>
      </div>
    </div>
  );
}