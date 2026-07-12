import React from 'react';

type AdminInputProps = {
  as?: 'input' | 'textarea';
  className?: string;
  [key: string]: any;
};

const AdminInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, AdminInputProps>(
  ({ as = 'input', className, type, ...props }, ref) => {
    let commonClasses = "p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading";
    if (type !== 'checkbox') {
      commonClasses += ' w-full';
    }

    if (as === 'textarea') {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={`${commonClasses} ${className || ''}`}
          {...props}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        className={`${commonClasses} ${className || ''}`}
        {...props}
      />
    );
  }
);

AdminInput.displayName = 'AdminInput';

export { AdminInput };
