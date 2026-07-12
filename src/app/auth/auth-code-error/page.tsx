import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading text-foreground">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            We couldn't complete your sign-in request. This might be due to an expired link or a technical issue.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            href="/"
            className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Home
          </Link>
          <p className="text-sm text-muted-foreground">
            Please try signing in again. If the problem persists, contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
