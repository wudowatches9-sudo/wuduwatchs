import React from 'react';

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const AdminTextarea = React.forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ className, ...props }, ref) => {
    const commonClasses = "p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading w-full";

    return (
      <textarea
        ref={ref}
        className={`${commonClasses} ${className}`}
        {...props}
      />
    );
  }
);

AdminTextarea.displayName = 'AdminTextarea';

export { AdminTextarea };
