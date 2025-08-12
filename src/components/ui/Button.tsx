import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2';

    const variantClasses = {
      primary: 'bg-brand-orange text-white hover:bg-brand-orange/90',
      secondary: 'bg-gray-200 text-brand-black hover:bg-gray-300',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    } as const;

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
